function updateVisiblePlans() {
    const finish = document.getElementById('finish').value;
    const marunagePlan = document.getElementById('marunage-plan');
    const yukkuriPlan = document.getElementById('yukkuri-plan');
    const kakikomiPlan = document.getElementById('kakikomi-plan');
    const sakuttoPlan = document.getElementById('sakutto-plan');

    if (finish === '写真仕上げ') {
        marunagePlan.style.display = 'none';
        sakuttoPlan.style.display = 'none';
    } else {
        marunagePlan.style.display = 'block';
        sakuttoPlan.style.display = 'block';
    }
}

// calculatePrice関数を以下のように修正してください
function calculatePrice() {
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (!quantity) {
        alert('枚数を指定してください');
        return;
    }

    const grade = document.getElementById('grade').value;
    const finish = document.getElementById('finish').value;
    const discount = document.getElementById('discount').value;
    const bringYourOwn = document.getElementById('bring-your-own').checked; // はがき持込のチェックボックス
    const dmCoupon = document.getElementById('dm-option').checked; // DMクーポンの状態を取得

    let selfPrice = calculateBasePrice(grade, finish, quantity);

    // 割引の適用
    switch(discount) {
        case '超早割':
            selfPrice = Math.floor(selfPrice * 0.8); // 20%オフ
            break;
        case '早割':
            selfPrice = Math.floor(selfPrice * 0.9); // 10%オフ
            break;
        // '通常料金'の場合は何もしない
    }

    // はがき持込の追加料金
    if (!bringYourOwn) {
        selfPrice += quantity * 85;
    }

    // DMクーポンの適用
    if(dmCoupon){
        selfPrice -= 500;
    }

    // 各プランの価格計算
    let sakuttoPrice = selfPrice + 1480;
    
    let omakasePrice = selfPrice;
    switch(discount) {
        case '超早割':
            omakasePrice += quantity * 100;
            break;
        case '早割':
        case '通常料金':
            omakasePrice += quantity * 200;
            break;
    }
    
    let marunagePrice = omakasePrice + 1480;

    // 結果の表示
    document.getElementById('yukkuri-plan-price').textContent = `¥${selfPrice.toLocaleString()}`;
    document.getElementById('self-plan-price').textContent = `¥${sakuttoPrice.toLocaleString()}`;
    document.getElementById('omakase-plan-price').textContent = `¥${omakasePrice.toLocaleString()}`;
    document.getElementById('marunage-plan-price').textContent = `¥${marunagePrice.toLocaleString()}`;
}

function calculateBasePrice(grade, finish, quantity) {
    console.debug("Start calculateBasePrice()");
    let basePrice;
    let additionalPrice;

    if (finish === '写真仕上げ') {
        switch(grade) {
            case '自分でデザイン':
                basePrice = 2200;
                break;
            case 'ライト':
                basePrice = 2800;
                break;
            case 'プレミアム':
                basePrice = 4800;
                break;
            case 'ハイグレード':
                basePrice = 5400;
                break;
            case 'スタンダード':
                basePrice = 3800;
                break;
        }
        additionalPrice = Math.max(0, Math.ceil((quantity - 10) / 10)) * 660;
    } else {
        switch(grade) {
            case '自分でデザイン':
                basePrice = 2000;
                break;
            case 'ライト':
                basePrice = 2600;
                break;
            case 'プレミアム':
                basePrice = 4600;
                break;
            case 'ハイグレード':
                basePrice = 5200;
                break;
            case 'スタンダード':
                basePrice = 3600;
                break;
        }
        if (quantity <= 10) {
            additionalPrice = 0;
        } else if (quantity <= 50) {
            additionalPrice = Math.ceil((quantity - 10) / 10) * 600;
        } else if (quantity <= 100) {
            additionalPrice = 4 * 600 + Math.ceil((quantity - 50) / 10) * 550;
        } else {
            additionalPrice = 4 * 600 + 5 * 550 + Math.ceil((quantity - 100) / 10) * 500;
        }
    }
    console.debug("End calculateBasePrice()");
    return basePrice + additionalPrice;
}

function getPriceForQuantity(quantity, priceList) {
    for (let item of priceList) {
        if (quantity <= item.max) {
            return item.price;
        }
    }
    return priceList[priceList.length - 1].price; // 100枚を超える場合は最後の価格を返す
}

// ファイルの最後に以下のコードを追加してください
document.addEventListener('DOMContentLoaded', function() {
    updateVisiblePlans();
    document.getElementById('finish').addEventListener('change', updateVisiblePlans);
});

// 計算ボタンにイベントリスナーを追加
document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculate-button');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculatePrice);
    }
});
