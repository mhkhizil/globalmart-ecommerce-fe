const fs = require('fs');
const path = require('path');
const filePath = path.join(
  __dirname,
  'src/components/module/user-order-detail/UserOrderDetail.tsx'
);
let content = fs.readFileSync(filePath, 'utf8');
content = content.replace(
  /'delivery\.status\.onTheWay\.short'/g,
  "'delivery.status.onTheWay.short'"
);
content = content.replace(
  /'delivery\.status\.delivered\.short'/g,
  "'delivery.status.delivered.short'"
);
content = content.replace(
  /'delivery\.status\.deliveryPreparing\.short'/g,
  "'delivery.status.deliveryPreparing.short'"
);
fs.writeFileSync(filePath, content, 'utf8');
console.log('File updated successfully!');
