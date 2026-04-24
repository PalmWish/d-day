const XLSX = require('xlsx-js-style');

function getHeadersFromData(rows) {
  const headerSet = new Set();

  rows.forEach((row) => {
    Object.keys(row || {}).forEach((key) => headerSet.add(key));
  });

  return Array.from(headerSet);
}

function normalizeRows(data) {
  return data.map((item) => (item && typeof item === 'object' ? item : {}));
}

function updateSheetRange(ws, rowIndex, colIndex) {
  const currentRange = XLSX.utils.decode_range(ws['!ref'] || 'A1');

  if (rowIndex > currentRange.e.r) {
    currentRange.e.r = rowIndex;
  }

  if (colIndex > currentRange.e.c) {
    currentRange.e.c = colIndex;
  }

  ws['!ref'] = XLSX.utils.encode_range(currentRange);
}

function applyHeaderStyle(ws, headers, style, headerRowIndex = 0) {
  headers.forEach((_, columnIndex) => {
    const cellAddress = XLSX.utils.encode_cell({ r: headerRowIndex, c: columnIndex });

    if (!ws[cellAddress]) {
      ws[cellAddress] = { t: 's', v: '' };
    }

    ws[cellAddress].s = style;
  });
}

function createSummary(
  ws,
  rows,
  summaryStartCol,
  summaryFillColor = 'D9EAD3',
  summaryField = 'stamp'
) {
  const numericStamps = rows
    .map((row) => Number(row[summaryField]))
    .filter((value) => Number.isFinite(value));

  const averageStamp = numericStamps.length
    ? numericStamps.reduce((sum, value) => sum + value, 0) / numericStamps.length
    : 0;

  const summaryRows = [
    { label: 'Total Count', value: rows.length },
    { label: `Avg ${summaryField}`, value: Number(averageStamp.toFixed(2)) },
  ];

  const labelStyle = {
    font: { bold: true, color: { rgb: '1F1F1F' } },
    fill: { fgColor: { rgb: summaryFillColor } },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: 'BFBFBF' } },
      right: { style: 'thin', color: { rgb: 'BFBFBF' } },
      bottom: { style: 'thin', color: { rgb: 'BFBFBF' } },
      left: { style: 'thin', color: { rgb: 'BFBFBF' } },
    },
  };

  const valueStyle = {
    font: { bold: false, color: { rgb: '1F1F1F' } },
    alignment: { horizontal: 'right', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: 'BFBFBF' } },
      right: { style: 'thin', color: { rgb: 'BFBFBF' } },
      bottom: { style: 'thin', color: { rgb: 'BFBFBF' } },
      left: { style: 'thin', color: { rgb: 'BFBFBF' } },
    },
  };

  summaryRows.forEach((summaryRow, index) => {
    const rowIndex = index + 1;
    const labelCellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: summaryStartCol });
    const valueCellAddress = XLSX.utils.encode_cell({
      r: rowIndex,
      c: summaryStartCol + 1,
    });

    ws[labelCellAddress] = {
      t: 's',
      v: summaryRow.label,
      s: labelStyle,
    };

    ws[valueCellAddress] = {
      t: 'n',
      v: summaryRow.value,
      s: valueStyle,
    };

    updateSheetRange(ws, rowIndex, summaryStartCol + 1);
  });

  return summaryRows;
}

function autoColumnWidth(ws, rows, headers, summaryStartCol, summaryRows) {
  const columnWidths = [];

  headers.forEach((header, columnIndex) => {
    const maxLength = rows.reduce((max, row) => {
      const value = row[header];
      const valueText = value === null || value === undefined ? '' : String(value);
      return Math.max(max, valueText.length);
    }, String(header).length);

    columnWidths[columnIndex] = { wch: Math.max(10, maxLength + 2) };
  });

  columnWidths[headers.length] = { wch: 3 };

  const summaryLabelWidth = summaryRows.reduce(
    (max, row) => Math.max(max, String(row.label).length),
    'Summary'.length
  );
  const summaryValueWidth = summaryRows.reduce(
    (max, row) => Math.max(max, String(row.value).length),
    5
  );

  columnWidths[summaryStartCol] = { wch: Math.max(14, summaryLabelWidth + 2) };
  columnWidths[summaryStartCol + 1] = { wch: Math.max(12, summaryValueWidth + 2) };

  ws['!cols'] = columnWidths;
}

function createWorksheetAndMetadata(data, options = {}) {
  if (!Array.isArray(data)) {
    throw new Error('Input data must be an array of JSON objects');
  }

  const rows = normalizeRows(data);
  const headers = options.headers && options.headers.length ? options.headers : getHeadersFromData(rows);

  if (!headers.length) {
    throw new Error('Cannot generate Excel file: no headers found in data');
  }

  const sheetName = options.sheetName || 'Sheet1';
  const summaryStartCol = headers.length + 1;

  const ws = XLSX.utils.json_to_sheet(rows, {
    header: headers,
    skipHeader: false,
  });

  const headerStyle = {
    font: { bold: true, color: { rgb: 'FFFFFF' } },
    fill: { fgColor: { rgb: options.headerFillColor || '1F4E78' } },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'thin', color: { rgb: 'FFFFFF' } },
      right: { style: 'thin', color: { rgb: 'FFFFFF' } },
      bottom: { style: 'thin', color: { rgb: 'FFFFFF' } },
      left: { style: 'thin', color: { rgb: 'FFFFFF' } },
    },
  };

  applyHeaderStyle(ws, headers, headerStyle, 0);

  const summaryRows = createSummary(
    ws,
    rows,
    summaryStartCol,
    options.summaryFillColor || 'D9EAD3',
    options.summaryField || 'stamp'
  );

  autoColumnWidth(ws, rows, headers, summaryStartCol, summaryRows);

  // Freeze the first row so headers stay visible while scrolling.
  ws['!freeze'] = {
    xSplit: 0,
    ySplit: 1,
    topLeftCell: XLSX.utils.encode_cell({ r: 1, c: 0 }),
    activePane: 'bottomLeft',
    state: 'frozen',
  };

  return {
    worksheet: ws,
    sheetName,
    metadata: {
      totalCount: rows.length,
      averageStamp: summaryRows[1].value,
    },
  };
}

function buildWorkbook(data, options = {}) {
  const { worksheet, sheetName, metadata } = createWorksheetAndMetadata(data, options);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, worksheet, sheetName);

  return {
    workbook: wb,
    metadata,
  };
}

function exportJsonToExcelBuffer(data, options = {}) {
  const { workbook, metadata } = buildWorkbook(data, options);
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  return {
    buffer,
    ...metadata,
  };
}

function exportJsonToExcelMultiSheetBuffer(sheets) {
  if (!Array.isArray(sheets) || sheets.length === 0) {
    throw new Error('Input sheets must be a non-empty array');
  }

  const workbook = XLSX.utils.book_new();
  const metadata = [];

  sheets.forEach((sheet) => {
    const { data, options = {} } = sheet || {};
    const { worksheet, sheetName, metadata: sheetMetadata } = createWorksheetAndMetadata(data, options);

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    metadata.push({ sheetName, ...sheetMetadata });
  });

  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  return {
    buffer,
    sheets: metadata,
  };
}

module.exports = {
  buildWorkbook,
  exportJsonToExcelBuffer,
  exportJsonToExcelMultiSheetBuffer,
  applyHeaderStyle,
  autoColumnWidth,
  createSummary,
};
