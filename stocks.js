let canvas = document.getElementById('canvas')
let c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let stock = [100]
let otherStock = [500]
let stockMax = 1000
let bank = 500
let heldStock = 0
let heldOtherStock = 0
if (localStorage.getItem('bank') != undefined) {
    stock = JSON.parse(localStorage.getItem('stock'))
    otherStock = JSON.parse(localStorage.getItem('otherStock'))
    stockMax = parseFloat(localStorage.getItem('stockMax'))
    bank = parseFloat(localStorage.getItem('bank'))
    heldStock = parseInt(localStorage.getItem('heldStock'))
    heldOtherStock = parseInt(localStorage.getItem('heldOtherStock'))
}
let mouse = {
    x: 0,
    y: 0
}
let keys = {
    shift: false
}
function Vector2(x, y) {
    return {x: x, y: y}
}
function reset() {
    stock = [100]
    otherStock = [500]
    stockMax = 500
    bank = 500
    heldStock = 0
    heldOtherStock = 0
}
function shortNumber(x) {
    let shortForms = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'O', 'N', 'D', 'UD', 'DD', 'TD', 'QaD', 'QiD', 'SxD', 'SpD', 'OD', 'ND', 'V', 'UV', 'DV', 'TV', 'QaV', 'QiV', 'SxV', 'SpV', 'OV', 'NV', 'Tr', 'UTr', 'DTr', 'TTr', 'QaTr', 'QiTr', 'SxTr', 'SpTr', 'OTr', 'NTr', 'Qd', 'UQd', 'DQd', 'TQd', 'QaQd', 'QiQd', 'SxQd', 'SpQd', 'OQd', 'NQd', 'Qg', 'UQg', 'DQg', 'TQg', 'QaQg', 'QiQg', 'SxQg', 'SpQg', 'OQg', 'NQg', 'Si', 'USi', 'DSi', 'TSi', 'QaSi', 'QiSi', 'SxSi', 'SpSi', 'OSi', 'NSi', 'Sg', 'USg', 'DSg', 'TSg', 'QaSg', 'QiSg', 'SxSg', 'SpSg', 'OSg', 'NSg', 'Og', 'UOg', 'DOg', 'TOg', 'QaOg', 'QiOg', 'SxOg', 'SpOg', 'OOg', 'NOg', 'Ng', 'UNg', 'DNg', 'TNg', 'QaNg', 'QiNg', 'SxNg', 'SpNg', 'ONg', 'NNg', 'Cn', 'UCn']
    let shortForm
    let digits = 0
    if (x.toString().includes('e')) {
        digits = +x.toString().slice(x.toString().indexOf('e')+2)
        shortForm = shortForms[Math.floor(digits/3)]
        return `${Math.floor(x/(10**(Math.floor(digits/3)*3))*10)/10}${shortForm}`
    } else if (x == Infinity) {
        return Infinity
    } else {
        digits = Math.round(x).toString().length-1
        shortForm = shortForms[Math.floor(digits/3)]
        return `${Math.floor(x/(10**(Math.floor(digits/3)*3))*10)/10}${shortForm}`
    }
    
}
function drawRect(pos, dim, r, g, b, a) {
    c.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.fillRect(pos.x, pos.y, dim.x, dim.y)
}
function drawLine(list, r, g, b, a) {
    c.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.beginPath()
    c.moveTo(list[0].x, list[0].y)
    for (let i of list) {
        c.lineTo(i.x, i.y)
    }
    c.stroke()
}
function drawPoly(list, r, g, b, a) {
    c.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.beginPath()
    c.moveTo(list[0].x, list[0].y)
    for (let i of list) {
        c.lineTo(i.x, i.y)
    }
    c.stroke()
    c.fill()
}
function drawArc(pos, rad, sa, ea, clock, r, g, b, a) {
    c.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.beginPath()
    c.arc(pos.x, pos.y, rad, sa, ea, !clock)
    c.stroke()
    c.fill()
}
function write(text, pos, r, g, b, a) {
    c.font = '20px Arial'
    c.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.fillText(text, pos.x, pos.y)
}
function clear() {
    c.clearRect(0, 0, window.innerWidth, window.innerHeight)
}
function draw() {
    clear()
    drawRect(Vector2(canvas.width/4, canvas.height/4), Vector2(canvas.width/2, canvas.height/2), 255, 255, 255, 1)
    let stockLine = []
    for (let i = 0; i < stock.length; i++) {
        stockLine.push(Vector2(i * (canvas.width/2)/stock.length + canvas.width/4, canvas.height * 3/4 - (stock[i] * (canvas.height/2)/stockMax)))
    }
    let otherStockLine = []
    for (let i = 0; i < otherStock.length; i++) {
        otherStockLine.push(Vector2(i * (canvas.width/2)/otherStock.length + canvas.width/4, canvas.height * 3/4 - (otherStock[i] * (canvas.height/2)/stockMax)))
    }
    drawLine(stockLine, 0, 255, 0, 1)
    drawLine(otherStockLine, 255, 0, 0, 1)
    drawLine([Vector2(canvas.width/4, canvas.height * 3/4), Vector2(canvas.width* 3/4, canvas.height * 3/4)], 127, 127, 127, 1)
    drawLine([Vector2(canvas.width/4, canvas.height * 3/4 - (Math.round(stockMax/5) * 1 * (canvas.height/2)/stockMax)), Vector2(canvas.width* 3/4, canvas.height * 3/4 - (Math.round(stockMax/5) * 1 * (canvas.height/2)/stockMax))], 127, 127, 127, 1)
    drawLine([Vector2(canvas.width/4, canvas.height * 3/4 - (Math.round(stockMax/5) * 2 * (canvas.height/2)/stockMax)), Vector2(canvas.width* 3/4, canvas.height * 3/4 - (Math.round(stockMax/5) * 2 * (canvas.height/2)/stockMax))], 127, 127, 127, 1)
    drawLine([Vector2(canvas.width/4, canvas.height * 3/4 - (Math.round(stockMax/5) * 3 * (canvas.height/2)/stockMax)), Vector2(canvas.width* 3/4, canvas.height * 3/4 - (Math.round(stockMax/5) * 3 * (canvas.height/2)/stockMax))], 127, 127, 127, 1)
    drawLine([Vector2(canvas.width/4, canvas.height * 3/4 - (Math.round(stockMax/5) * 4 * (canvas.height/2)/stockMax)), Vector2(canvas.width* 3/4, canvas.height * 3/4 - (Math.round(stockMax/5) * 4 * (canvas.height/2)/stockMax))], 127, 127, 127, 1)
    drawLine([Vector2(canvas.width/4, canvas.height * 3/4 - (Math.round(stockMax/5) * 5 * (canvas.height/2)/stockMax)), Vector2(canvas.width* 3/4, canvas.height * 3/4 - (Math.round(stockMax/5) * 5 * (canvas.height/2)/stockMax))], 127, 127, 127, 1)
    document.getElementById('one').innerText = `$${shortNumber(Math.round(stockMax/5) * 0)}`
    document.getElementById('two').innerText = `$${shortNumber(Math.round(stockMax/5) * 1)}`
    document.getElementById('three').innerText = `$${shortNumber(Math.round(stockMax/5) * 2)}`
    document.getElementById('four').innerText = `$${shortNumber(Math.round(stockMax/5) * 3)}`
    document.getElementById('five').innerText = `$${shortNumber(Math.round(stockMax/5) * 4)}`
    document.getElementById('six').innerText = `$${shortNumber(Math.round(stockMax/5) * 5)}`
    document.getElementById('Bank').innerText = `Bank: $${shortNumber(Math.round(bank*10)/10)}`
    document.getElementById('Held_Stock').innerText = `Held Stock: ${shortNumber(heldStock)} | ${shortNumber(heldOtherStock)} ($${shortNumber(Math.round(heldStock*stock[stock.length-1]) + Math.round(heldOtherStock*otherStock[otherStock.length-1]))})`
    document.getElementById('Stock_Worth').innerText = `Stock Worth: $${shortNumber(Math.round(stock[stock.length-1]*10)/10)} | ${shortNumber(Math.round(otherStock[otherStock.length-1]*10)/10)}`
    drawRect(Vector2(canvas.width/2-50, canvas.height*3/4+35), Vector2(50, 50), 0, 255, 0, 1)
    drawRect(Vector2(canvas.width/2-50, canvas.height*3/4+95), Vector2(50, 50), 0, 255, 0, 1)
    drawRect(Vector2(canvas.width/2, canvas.height*3/4+35), Vector2(50, 50), 255, 0, 0, 1)
    drawRect(Vector2(canvas.width/2, canvas.height*3/4+95), Vector2(50, 50), 255, 0, 0, 1)
}
function run() {
    draw()
    let newStock = stock[stock.length-1]+(Math.random()-0.5)*50
    if (Math.round(newStock*10)/10 > 0) {
        stock.push(Math.round(newStock*10)/10)
        if (stockMax < Math.round(newStock*10)/10) {
            stockMax = Math.round(newStock*10)/10
        }
    } else {
        stock.push(0)
    }
    let otherNewStock = otherStock[otherStock.length-1]+(Math.random()-0.5)*250
    if (Math.round(otherNewStock*10)/10 > 100) {
        if (Math.round(otherNewStock*10)/10 < 300) {
            otherNewStock += 25 * (100-(Math.round(otherNewStock*10)/10 - 300))/10
        }
        otherStock.push(Math.round(otherNewStock*10)/10)
        if (stockMax < Math.round(otherNewStock*10)/10) {
            stockMax = Math.round(otherNewStock*10)/10
        }
    } else {
        otherStock.push(100)
    }
    localStorage.setItem('stock', `[${stock}]`)
    localStorage.setItem('otherStock', `[${otherStock}]`)
    localStorage.setItem('stockMax', `${stockMax}`)
    localStorage.setItem('bank', `${bank}`)
    localStorage.setItem('heldStock', `${heldStock}`)
    localStorage.setItem('heldOtherStock', `${heldOtherStock}`)
}
document.addEventListener("keydown", function(event) {
    switch(event.keyCode) {
        case 16:
        keys.shift = true
        break
        case 220:
        otherStock.push(otherStock[otherStock.length-1]+500)
        break
    }
})
document.addEventListener("keyup", function(event) {
    switch(event.keyCode) {
        case 16:
        keys.shift = false
        break
    }
})
document.addEventListener("mousemove", function(event) {
    mouse.x = event.clientX
    mouse.y = event.clientY
})
document.addEventListener("click", function(event) {
    mouse.x = event.clientX
    mouse.y = event.clientY
    if (canvas.width/2-50 < mouse.x && mouse.x < canvas.width/2) {
        if (canvas.height*3/4+35 < mouse.y && mouse.y < canvas.height*3/4+85) {
            if (bank - Math.round(stock[stock.length-1]+1) >= 0) {
                if (keys.shift) {
                    heldStock += Math.floor(bank/Math.round(stock[stock.length-1]+1))
                    bank -= Math.floor((bank/Math.round(stock[stock.length-1]+1))) * Math.round(stock[stock.length-1]+1)
                } else {
                    bank -= Math.round(stock[stock.length-1]*10)/10
                    heldStock++
                }
            }
        }
        if (canvas.height*3/4+95 < mouse.y && mouse.y < canvas.height*3/4+145) {
            if (heldStock != 0) {
                if (keys.shift) {
                    bank += Math.round(stock[stock.length-1]*10)/10 * heldStock
                    heldStock = 0
                } else {
                    bank += Math.round(stock[stock.length-1]*10)/10
                    heldStock--
                }
            }
        }
    }
    if (canvas.width/2 < mouse.x && mouse.x < canvas.width/2+50) {
        if (canvas.height*3/4+35 < mouse.y && mouse.y < canvas.height*3/4+85) {
            if (bank - Math.round(otherStock[otherStock.length-1]+1) >= 0) {
                if (keys.shift) {
                    heldOtherStock += Math.floor(bank/Math.round(otherStock[otherStock.length-1]+1))
                    bank -= Math.floor((bank/Math.round(otherStock[otherStock.length-1]+1))) * Math.round(otherStock[otherStock.length-1]+1)
                } else {
                    bank -= Math.round(otherStock[otherStock.length-1]*10)/10
                    heldOtherStock++
                }
            }
        }
        if (canvas.height*3/4+95 < mouse.y && mouse.y < canvas.height*3/4+145) {
            if (heldOtherStock != 0) {
                if (keys.shift) {
                    bank += Math.round(otherStock[otherStock.length-1]*10)/10 * heldOtherStock
                    heldOtherStock = 0
                } else {
                    bank += Math.round(otherStock[otherStock.length-1]*10)/10
                    heldOtherStock--
                }
            }
        }
    }
    if (mouse.x < 100 && mouse.y < 100) {
        reset()
    }
})
setInterval(run, 100)
