document.getElementById('functionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const functionInput = document.getElementById('function').value;

    // キャンバスの設定
    const canvas = document.getElementById('graphCanvas');
    const ctx = canvas.getContext('2d');

    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // グラフの中心を設定（x = 300, y = 300 が原点(0,0)）
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 30; // スケールを30に設定（1単位 = 30ピクセル）

    // 軸を描画
    ctx.beginPath();
    ctx.moveTo(0, centerY); // y軸
    ctx.lineTo(canvas.width, centerY);
    ctx.moveTo(centerX, 0); // x軸
    ctx.lineTo(centerX, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // x軸とy軸に目盛りを追加
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    for (let i = -10; i <= 10; i++) {
        const xPos = centerX + i * scale;
        const yPos = centerY - i * scale;

        // x軸の目盛り
        ctx.fillText(i, xPos - 5, centerY + 15); // 数字を描く
        ctx.beginPath();
        ctx.moveTo(xPos, centerY - 5);
        ctx.lineTo(xPos, centerY + 5);
        ctx.stroke();

        // y軸の目盛り
        ctx.fillText(-i, centerX + 5, yPos + 5); // 数字を描く
        ctx.beginPath();
        ctx.moveTo(centerX - 5, yPos);
        ctx.lineTo(centerX + 5, yPos);
        ctx.stroke();
    }

    // 放物線をより細かく滑らかに描画
    ctx.beginPath();
    ctx.strokeStyle = 'blue';

    for (let x = -10; x <= 10; x += 0.001) {  // ステップサイズを0.001にしてさらに滑らかに
        const pixelX = centerX + x * scale;
        const y = eval(functionInput.replace(/x/g, x)); // 二次関数のyを計算
        const pixelY = centerY - y * scale; // y座標をピクセルに変換

        if (x === -10) {
            ctx.moveTo(pixelX, pixelY);
        } else {
            ctx.lineTo(pixelX, pixelY);
        }
    }

    ctx.stroke();

    // グラフを画像としてコピーする機能（エラーハンドリング追加）
    document.getElementById('copyButton').onclick = function() {
        canvas.toBlob(function(blob) {
            if (navigator.clipboard && navigator.clipboard.write) {
                const item = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([item])
                    .then(() => {
                        alert('グラフがクリップボードにコピーされました！');
                    })
                    .catch(err => {
                        alert('コピーに失敗しました: ', err);
                    });
            } else {
                // コピー機能がサポートされていない場合、画像をダウンロード
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'graph.png';
                a.click();
                alert('クリップボードのコピーに失敗しましたが、画像がダウンロードされました！');
            }
        });
    };
});