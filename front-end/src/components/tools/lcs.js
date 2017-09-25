/**
 * Created by edeity on 16/8/23.
 * 动态规划算法, 作用于比较两个java文件的异同,具体的应用可以参考beyondcompare
 */


function initArray(m, n) {
    var temp = new Array();
    for(var i=0; i<m; i++) {
        temp[i] = new Array();
        for(var j=0; j<n; j++) {
            temp[i][j] = '';
        }
    }
    return temp;
}
/**
 * 求lcs树
 */
function lcs(x, y, m, n, c, b) {

    for (var i = 0; i <= m; i++) {
        c[i][0] = 0;
    }

    for (var j = 1; j <= n; j++) {
        c[0][j] = 0;
    }

    // 求最长公共字符串
    for (var i = 1; i <= m; i++) {
        for (var j = 1; j <= n; j++) {
            if (x[i-1] === y[i-1]) {
                c[i][j] = c[i - 1][j - 1] + 1;
                b[i][j] = 0;
            } else if (c[i - 1][j] >= c[i][j - 1]) {
                c[i][j] = c[i - 1][j];
                b[i][j] = 1;
            } else {
                c[i][j] = c[i][j - 1];
                b[i][j] = -1;
            }
        }
    }

    return b;
}

function print_lcs(b, x, i, j) {
    if (i === 0 || j === 0) {
        return;
    }
    if (b[i][j] === 0) {
        print_lcs(b, x, i - 1, j - 1);
        process.stdout.write(x[i - 1] + " ");
    } else if (b[i][j] === 1) {
        print_lcs(b, x, i - 1, j);
    } else {
        print_lcs(b, x, i, j - 1);
    }
}

function main() {
    var x = "A,A,A,A,A,B,C,D,E,F,G,B,A".split(',');
    var y = "C,D,U,W,A,B,C,E,F,D".split(',');

    var m = x.length;
    var n = y.length;
    var c = initArray(m+1, n+1); //[m+1][n+1]
    var b = initArray(m+1, n+1); //[m+1][n+1]

    var d = lcs(x, y, m, n, c, b);
    print_lcs(d, x, m, n);

}

main();