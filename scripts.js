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
    const quantity = parseInt(document.getElementById('quantity').value) || 0;

    const grade = document.getElementById('grade').value;
    const finish = document.getElementById('finish').value;
    const discount = document.getElementById('discount').value;
    const bringYourOwn = document.getElementById('bring-your-own').checked;
    const dmCoupon = document.getElementById('dm-option').checked;
    const inputAssistance = document.getElementById('input-assistance').checked;

    // 印刷代の計算
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

    // はがき持込なしの追加料金
    if (!bringYourOwn) {
        selfPrice += quantity * 85;
    }

    // DMクーポンの適用
    if(dmCoupon){
        switch(discount) {
            case '超早割':
            case '早割':
                selfPrice -= 500;
                break;
            case '通常料金':
                selfPrice -= 300;
                break;
        }
    }

     // 入力代行の追加料金
     if (inputAssistance) {
        selfPrice += 1500;
    }

    // 各プランの価格計算
    // サクッとプランの計算
    let sakuttoPrice = selfPrice + 1480;
    
    // のんびりおまかせプランの計算
    let omakasePrice = selfPrice;
    switch(discount) {
        case '超早割':
        case '早割':
            omakasePrice += quantity * 100;
            break;
        case '通常料金':
            omakasePrice += quantity * 200;
            break;
    }
    
    // まるっとおまかせプランの計算
    let marunagePrice = omakasePrice + 1960;

    if(quantity == null || quantity == 0){
        selfPrice = 0;
        sakuttoPrice = 0;
        omakasePrice = 0;
        marunagePrice = 0;
    }
    document.getElementById('yukkuri-plan-price').textContent = `¥${(isNaN(selfPrice) ? 0 : selfPrice).toLocaleString()}`;
    document.getElementById('self-plan-price').textContent = `¥${(isNaN(sakuttoPrice) ? 0 : sakuttoPrice).toLocaleString()}`;
    document.getElementById('omakase-plan-price').textContent = `¥${(isNaN(omakasePrice) ? 0 : omakasePrice).toLocaleString()}`;
    document.getElementById('marunage-plan-price').textContent = `¥${(isNaN(marunagePrice) ? 0 : marunagePrice).toLocaleString()}`;
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

// JavaScriptコード
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById("myModal");
    const span = document.getElementsByClassName("close")[0];

    // 各入力要素にイベントリスナーを追加
    const inputs = ['quantity', 'grade', 'finish', 'discount', 'bring-your-own', 'dm-option', 'input-assistance'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', calculatePrice);
            element.addEventListener('change', calculatePrice);
        }
    });

    // 各プランカードにクリックイベントを追加
    document.querySelectorAll('.plan-card').forEach(card => {
        card.addEventListener('click', function(event) {
            event.preventDefault(); // デフォルトの動作を防止
            if (document.getElementById('quantity').value == null || document.getElementById('quantity').value == 0) {
                alert('枚数を入力してください。');
                return;
            }
            // モーダルを表示
            modal.style.display = "block";
            const planTitleElement = this.querySelector('.card-title');
            if (planTitleElement) {
                const planName = planTitleElement.innerText;
                const planPriceElement = this.querySelector('.result-price');
                const totalCost = parseInt(planPriceElement.textContent.replace('¥', '').replace(',', ''));
                // 枚数を取得
                const quantity = parseInt(document.getElementById('quantity').value);
                // はがき持込なしの追加料金
                const bringYourOwn = document.getElementById('bring-your-own').checked;

                // はがき代の計算
                let postcardCost = 0;
                if (!bringYourOwn) {
                    postcardCost = quantity * 85;
                }

                // DMクーポンの割引情報を表示
                const dmCoupon = document.getElementById('dm-option').checked;
                const discount = document.getElementById('discount').value;
                let dmDiscount = 0;

                if (dmCoupon) {
                    switch(discount) {
                        case '超早割':
                        case '早割':
                            dmDiscount = 500;
                            break;
                        case '通常料金':
                            dmDiscount = 300;
                            break;
                    }
                }

                if(dmDiscount > 0)
                {
                    document.getElementById('dmDiscount').innerText = `¥-${dmDiscount.toLocaleString()}`;
                }
                else{
                    document.getElementById('dmDiscount').innerText = `¥${dmDiscount.toLocaleString()}`
                }

                // 印刷代からクーポン割引を引いた金額を表示
                const printCost = totalCost - postcardCost + dmDiscount;
                document.getElementById('printCost').innerText = `¥${printCost.toLocaleString()}`;

                document.getElementById('planName').innerText = planName;
                document.getElementById('postcardCost').innerText = `¥${postcardCost.toLocaleString()}`;
                document.getElementById('totalCost').innerText = `¥${totalCost.toLocaleString()}`;
                
                const completionDateElement = document.getElementById('completionDate');
                 // 仕上がり日を計算して表示
                if (completionDateElement) {
                    const completionDate = calculateCompletionDate(planName);
                    completionDateElement.innerHTML = `仕上がり目安: <span>${completionDate}</span>`;
                }

                // モーダルを表示
                modal.style.display = "block";
            } else {
                console.error("カードタイトルが見つかりません");
            }
        });
    });

    // モーダルを閉じる
    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});
// プランごとの所要日数を定義
const PLAN_DAYS = {
    'まるっとおまかせプラン': 4,
    'のんびりおまかせプラン': 7,
    '宛名なし高速プラン': 0,
    'セルフプラン': 5
};

// 曜日の配列を定義
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

// 日付計算関数を修正
function calculateCompletionDate(planName) {
    const days = PLAN_DAYS[planName];
    const today = new Date();
    const completionDate = new Date(today);
    completionDate.setDate(today.getDate() + days);
    
    // 日付フォーマットを設定
    const month = completionDate.getMonth() + 1;
    const date = completionDate.getDate();
    const weekday = WEEKDAYS[completionDate.getDay()];
    
    if (days === 0) {
        return '1時間後';
    } else {
        return `${month}月${date}日(${weekday})`;
    }
}
