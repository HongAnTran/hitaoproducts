const cates = [ 
    {
      categoryId: 2425401,
      categoryName: "LOCK",
      retailerId: 1414950,
      createdDate: "2024-09-08T19:08:11.5530000",
      rank: 0
    },
    {
      categoryId: 2425402,
      categoryName: "QUỐC TẾ",
      retailerId: 1414950,
      createdDate: "2024-09-08T19:08:21.7800000",
      rank: 0
    },
    {
      categoryId: 2425403,
      parentId: 2425401,
      categoryName: "New L",
      retailerId: 1414950,
      modifiedDate: "2024-10-05T12:28:59.2030000",
      createdDate: "2024-09-08T19:08:28.9300000",
      rank: 0
    },
    {
      categoryId: 2425404,
      parentId: 2425402,
      categoryName: "New Q",
      retailerId: 1414950,
      modifiedDate: "2024-10-05T12:28:18.2400000",
      createdDate: "2024-09-08T19:08:35.2030000",
      rank: 0
    },
    {
      categoryId: 2425421,
      parentId: 2425402,
      categoryName: "Used Q",
      retailerId: 1414950,
      modifiedDate: "2024-10-05T12:28:25.7000000",
      createdDate: "2024-09-09T01:28:42.7430000"
    },
    {
      categoryId: 2425420,
      parentId: 2425401,
      categoryName: "Used L",
      retailerId: 1414950,
      modifiedDate: "2024-10-05T12:28:52.4230000",
      createdDate: "2024-09-09T01:28:42.7430000"
    },
    {
      categoryId: 2427177,
      categoryName: "PHỤ KIỆN",
      retailerId: 1414950,
      createdDate: "2024-10-01T15:49:51.3870000",
      rank: 0
    },
    {
      categoryId: 2436896,
      parentId: 2427177,
      categoryName: "Sạc",
      retailerId: 1414950,
      createdDate: "2025-01-02T22:29:43.3630000"
    },
    {
      categoryId: 2436897,
      parentId: 2427177,
      categoryName: "Combo BV",
      retailerId: 1414950,
      modifiedDate: "2025-01-10T14:25:50.4170000",
      createdDate: "2025-01-02T22:31:17.4970000"
    }
  ]
async function fetchAllInvoices() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var url = "https://public.kiotapi.com/invoices?format=json&pageSize=100&includePayment=false&status=1&includes=Customer&orderBy=purchaseDate&orderDirection=Desc";
  var headers = {
    "Content-Type": "application/json",
    "Retailer": "hitao",
    "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCJ9.eyJuYmYiOjE3NDA0MDM1NDEsImV4cCI6MTc0MDQ4OTk0MSwiaXNzIjoiaHR0cDovL2lkLmtpb3R2aWV0LnZuIiwiY2xpZW50X2lkIjoiOGVlYTk0YmUtNGI2Yi00YzJkLTk1MTUtZjI1YzI1M2Q3OTY0IiwiY2xpZW50X1JldGFpbGVyQ29kZSI6ImhpdGFvIiwiY2xpZW50X1JldGFpbGVySWQiOiIxNDE0OTUwIiwiY2xpZW50X1VzZXJJZCI6IjEzMjYxMTIiLCJjbGllbnRfU2Vuc2l0aXZlQXBpIjoiVHJ1ZSIsImNsaWVudF9Hcm91cElkIjoiMTQiLCJpYXQiOjE3NDA0MDM1NDEsInNjb3BlIjpbIlB1YmxpY0FwaS5BY2Nlc3MiXX0.Ikdj76-YSnYrjZOeYi6OSK3vprsP_0e9UvvZ_GmlzFo6LMlIQbWSEfwvi_cnQr1GklU2c3I0r9f_6Q-FkKPbdGR3HJTJb6RZS-Kw9n2q__RlA1TzHdzeTsrnPQEDGse9lr-cUiDW-cM5dy66_4hKlYxUG7F23DJaaC0z0mPAonw0M851Vqp91wPwAapDvPafQVjQYLeH0fgi6LHfnm0p6s2TaMPg1gb5YsXtCrDQmUdov1KTqNGzjvO0TEVrTodnXeW2m2MIze1du74cUYBXUhq8IMlWn60cNQ8zoFUWxnpKANWZgBfHXM6vqQE2qLeXzW6-M-qt25D2efx-dX_d-g"
  };

  var currentItem = 3300;
  var total = 3754;
  var customerCache = {};
  var startIndex = sheet.getLastRow() - 1;

  while (currentItem < total) {
    try {
      var response = UrlFetchApp.fetch(url + "&currentItem=" + currentItem, {
        method: "get",
        headers: headers,
      });
      var json = JSON.parse(response.getContentText());

      if (!json.data || json.data.length === 0) break;

      // Lấy danh sách customerCode duy nhất
      var customerCodes = [...new Set(json.data.map(item => item.customerCode).filter(code => code))];

      // Gọi API lấy thông tin khách hàng
      var customersData = await fetchCustomersByCode(customerCodes, headers, customerCache);

      // Chuẩn bị dữ liệu để ghi vào Google Sheets
      var values = json.data.map((item, index) => {
        const products = item.invoiceDetails.filter(p => !p.productName.toLowerCase().includes("bảo hành"));
        const baohanh = item.invoiceDetails.find(p => p.categoryName.toLowerCase().includes('bảo hành'));
        const product = item.invoiceDetails.length === 1 ? item.invoiceDetails[0] : products.length === 1 
          ? products[0] 
          : products.reduce((max, item) => (item.price > max.price ? item : max), products[0]);
        const cus = customersData[item.customerCode] || {};
        const categoryId = product.categoryId;
        const cate = cates.find(ca => ca.categoryId === categoryId);
        const cateCha = cate?.parentId ? cates.find(ca => ca.categoryId === cate.parentId) : null;
        const cateName = cateCha ? `${cateCha.categoryName} > ${cate.categoryName}` : cate?.categoryName || null;

        return [
          startIndex + index + 1,
          product.productName,
          cateName,
          product.tradeMarkName || null,
          product.productCode || null,
          item.customerName || null,
          cus.address || null,
          cus.contactNumber || null,
          formatDate(item.purchaseDate),
          item.soldByName || null,
          baohanh?.productName || null,
          null,
          item.code
        ];
      });

      // Ghi dữ liệu theo batch để tối ưu
      sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);

      currentItem += 100;
      startIndex += values.length;
      Utilities.sleep(200);
    } catch (error) {
      Logger.log("Lỗi khi lấy hóa đơn: " + error);
      break;
    }
  }

  Logger.log("Dữ liệu đã được ghi thành công vào Google Sheets!");
}

function fetchCustomersByCode(customerCodes, headers, customerCache) {
  var customers = {};

  customerCodes.forEach(code => {
    if (customerCache[code]) {
      // Lấy từ cache
      customers[code] = customerCache[code];
    } else {
      // Gọi API lấy khách hàng
      var url = "https://public.kiotapi.com/customers/code/" + encodeURIComponent(code);
      try {
        var response = UrlFetchApp.fetch(url, {
          method: "get",
          headers: headers,
        });

        var json = JSON.parse(response.getContentText());

        const data = {
          code: json.code,
          name: json.name,
          contactNumber: json.contactNumber,
          address: json.address,
        };
        Logger.log(data)
        if (json) {
          customers[code] = data;
          customerCache[code] = data; // Lưu vào cache
        }
        
        Utilities.sleep(200); // Tránh bị giới hạn API
      } catch (e) {
        Logger.log("Lỗi khi lấy khách hàng: " + code + " - " + e);
        customers[code] = { name: "N/A" }; // Nếu lỗi thì gán "N/A"
      }
    }
  });

  return customers;
}


function formatDate(isoString) {
  const date = new Date(isoString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function myFunction() {
  fetchAllInvoices();
}
