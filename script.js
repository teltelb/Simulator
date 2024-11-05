const priceTable = {
    selfDesign: {
        photo: { 10: { superEarly: 2000, early: 2200, regular: 2400 }, /*...*/ },
        printing: { 10: 2000, 20:2600,30: 3200, 40:3800, 50:4400,60:4950,70:5500 ,80:6050 ,90:6600 , 100:7150}
    },
    light: {
        printing: { 10: { superEarly: 1760, early: 1980, regular: 2200 }, /*...*/ },
        photo: { 10: { superEarly: 2160, early: 2400, regular: 2640 }, /*...*/ }
    },
    // 他のプランも同様に追加
};

function calculatePrice() {
    const plan = document.getElementById('plan').value;
    const finishType = document.getElementById('finishType').value;
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    const discount = document.getElementById('discount').value;
    const addressPrint = document.getElementById('addressPrint').checked;

    // 枚数に応じた料金を取得
    const availableQuantities = Object.keys(priceTable[plan][finishType]);
    const closestQuantity = availableQuantities.find(q => quantity <= q) || availableQuantities[availableQuantities.length - 1];

    // 割引に応じた料金を取得
    let basePrice;
    if (discount === 'superEarly') {
        basePrice = priceTable[plan][finishType][closestQuantity].superEarly;
    } else if (discount === 'early') {
        basePrice = priceTable[plan][finishType][closestQuantity].early;
    } else {
        basePrice = priceTable[plan][finishType][closestQuantity].regular;
    }

    // 宛名印刷の追加料金
    if (addressPrint) basePrice += 500;

    const totalPrice = basePrice * (quantity / 10);
    
    // 結果表示
    document.getElementById('priceResult').textContent = `総額: ¥${totalPrice.toLocaleString()}`;
}
