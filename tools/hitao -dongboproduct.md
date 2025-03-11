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
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Tonkho")
  var url = "https://public.kiotapi.com/products?format=json&includeInventory=true&isActive=true&pageSize=100&includeQuantity=true"
  var headers = {
    "Content-Type": "application/json",
    "Retailer": "hitao",
    "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCJ9.eyJuYmYiOjE3NDEwMjMwMjUsImV4cCI6MTc0MTEwOTQyNSwiaXNzIjoiaHR0cDovL2lkLmtpb3R2aWV0LnZuIiwiY2xpZW50X2lkIjoiOGVlYTk0YmUtNGI2Yi00YzJkLTk1MTUtZjI1YzI1M2Q3OTY0IiwiY2xpZW50X1JldGFpbGVyQ29kZSI6ImhpdGFvIiwiY2xpZW50X1JldGFpbGVySWQiOiIxNDE0OTUwIiwiY2xpZW50X1VzZXJJZCI6IjEzMjYxMTIiLCJjbGllbnRfU2Vuc2l0aXZlQXBpIjoiVHJ1ZSIsImNsaWVudF9Hcm91cElkIjoiMTQiLCJpYXQiOjE3NDEwMjMwMjUsInNjb3BlIjpbIlB1YmxpY0FwaS5BY2Nlc3MiXX0.xuu7PwiqdMFR1Q6ZBZVwAQCRLs4V8eqdXjKKBRaOb-y94zFC9Sam9ntijlRo8SpnEQFSvM09_OfMeeJhBIc4gvMpCKGv-rdLtOY4-YfOWX2ZgilmihbRCmcoJC6587ybIaA3m40u2QPLWtE_3aTukBawbOn_igdMoM6SkOuCfs54lJhqk5DmIFta8Qwk1xx-ZwcxHHJIqbzx2t-TmxbREcLWfMnR7csj2yGpeB0OOdpcE1BcFHH31eYy3oIvrPkirZK35W0ZS1IfqA5gailIqW3wlHpO8TviMbVkkdsN0zXSMUEElJbhobKyrh_gm6vsYTw75PzTHEHVYXpVEHIM-A"
  };

  var currentItem = 0;
  var total = 4155;
  var startIndex = sheet.getLastRow() - 1;

  while (currentItem < total) {
    try {
      var response = UrlFetchApp.fetch(url + "&currentItem=" + currentItem, {
        method: "get",
        headers: headers,
      });
      var json = JSON.parse(response.getContentText());
      if (!json.data || json.data.length === 0) break;
    const products = json.data.filter(pro=>pro.inventories[0].onHand > 0)
      var values = products.map((item, index) => {
        const categoryId = item.categoryId;
        const cate = cates.find(ca => ca.categoryId === categoryId);
        const cateCha = cate?.parentId ? cates.find(ca => ca.categoryId === cate.parentId) : null;
        const cateName = cateCha ? `${cateCha.categoryName} > ${cate.categoryName}` : cate?.categoryName || null;
      const onHand = item.inventories[0].onHand
      const cost = item.inventories[0].cost
        return [
          startIndex + index + 1,
          item.code,
           onHand,
          item.fullName,
          cateName,
          item.tradeMarkName,
          item.description,
          cost
        ];
      });

      sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);

      currentItem += 100;
      Logger.log(currentItem)
      startIndex += values.length;
      Utilities.sleep(200);
    } catch (error) {
      Logger.log("Lỗi khi lấy hóa đơn: " + error);
      break;
    }
  }
  Logger.log("Dữ liệu đã được ghi thành công vào Google Sheets!");
}


function myFunction() {
  fetchAllInvoices();
}
