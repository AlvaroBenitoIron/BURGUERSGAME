window.onload = () => {
    document.getElementById('start-button').onclick = () => {
        startGame();
    };

    function startGame() {

        gameApp.init('canvas')
        gameApp.setDimensions()

    }
};

const gameApp = {
    name: 'Burgers game',
    description: 'E-learning for coocking apprentice',
    version: '1.0.0',
    author: 'Alvaro y Guillermo',
    license: undefined,
    canvasNode: undefined,
    ctx: undefined,
    gameSize: { w: undefined, h: undefined },
    plate: undefined,
    ingredients: [],
    allPiggish: [],
    framesIndex: 0,
    timer: 30,
    lives: [],




    init(canvas) {
        this.canvasNode = document.querySelector(`#${canvas}`)
        this.ctx = this.canvasNode.getContext('2d')
        this.setDimensions()
        this.createPlate()
        // this.createLife()
        this.setEventListeners()
        this.start()
    },

    setDimensions() {
        this.gameSize = {
            w: 500,
            h: 600
        }
    },

    createPlate() {
        this.plate = new Plate(this.ctx, this.gameSize, this.gameSize.w / 2 - 75, this.gameSize.h - 50, 150, 30)
    },

    drawPlate() {
        this.plate.draw()
    },

    // createLife() {
    //     this.life = new Life(this.ctx, this.gameSize, this.gameSize.w / 2 - 10, 50, 50, 100)
    // },

    // drawLife() {
    //     this.life.draw()
    // },

    drawAll() {
        this.drawPlate()



        this.allPiggish.forEach(eachPiggish => eachPiggish.draw())

        this.ingredients.forEach(eachIngredient => eachIngredient.draw())

        this.drawOrder()
        // this.drawLife()



    },

    setEventListeners() {
        document.onkeydown = event => {
            const { key } = event
            if (key === 'ArrowLeft') {
                this.plate.moveLeft()
            }
            if (key === 'ArrowRight') {
                this.plate.moveRight()
            }
        }
    },

    start() {
        this.interval = setInterval(() => {

            if (this.framesIndex >= 300 && this.framesIndex % 270 === 0) {
                this.createPiggish()
            }

            if (this.framesIndex >= 5 && this.framesIndex % 50 === 0) {
                this.randomNumber()
            }

            this.clearAll()
            this.drawAll()

            this.checkLives()

            this.checkIngredientCollision()
            this.checkPiggishCollisions() ? this.gameOver() : null
            this.updateClock()
            this.victory()

            this.framesIndex++
        }, 30)
    },

    createPiggish() {
        this.allPiggish.push(new Piggish(this.ctx, this.gameSize, Math.random() * this.gameSize.w * .75, 0, 5))
    },

    clearAll() {
        this.ctx.clearRect(0, 0, this.gameSize.w, this.gameSize.h)
        this.clearPiggish()
        this.clearIngredients()
    },

    clearPiggish() {
        // this.allPiggish = this.allPiggish.filter(eachPiggish => eachPiggish.piggishPos.y + eachPiggish.h < 700) PO QUÉ ASÍ NO FUNCIONA?
        this.allPiggish.forEach(eachPiggish => {
            if (eachPiggish.piggishPos.y > 700) {
                this.allPiggish.shift()
            }
        })

    },

    randomNumber() {
        let a = 1
        let b = 5
        let random = Math.floor(Math.random() * (b - a) + parseInt(a));
        this.createIngredient(random)
        return random
    },

    createIngredient(random) {
        if (random === 1) {
            this.ingredients.push(new Bread1(this.ctx, this.gameSize, Math.random() * this.gameSize.w * .75, 0, 5))
        }
        if (random === 2) {
            this.ingredients.push(new Meat(this.ctx, this.gameSize, Math.random() * this.gameSize.w * .75, 0, 5))
        }

        if (random === 3) {
            this.ingredients.push(new Cheese(this.ctx, this.gameSize, Math.random() * this.gameSize.w * .75, 0, 5))
        }
        if (random === 4) {
            this.ingredients.push(new Bread2(this.ctx, this.gameSize, Math.random() * this.gameSize.w * .75, 0, 5))
        }

    },

    clearIngredients() {
        this.ingredients.forEach(eachIngredient => {
            if (eachIngredient.ingredientPos.y > 700) {
                this.ingredients.shift()
            }
        })
    },

    drawOrder() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        this.ctx.fillRect(10, 20, 150, 190)
        this.ctx.font = 'bold 20pt Menlo'
        this.ctx.fillStyle = 'white'
        this.ctx.fillText('Order:', 20, 50)
        this.ctx.font = 'bold 15pt Menlo'
        this.ctx.fillText(`${allBurgers[0].name}`, 20, 75)

        this.ctx.font = 'bold 10pt Menlo'
        let place = 95
        allBurgers[0].ingredients.forEach(eachIngredient => {
            this.ctx.fillText(`${eachIngredient}`, 20, place)
            place += 15
        })
        this.ctx.font = 'bold 25pt Menlo'
        this.ctx.fillStyle = 'white'
        this.ctx.fillText(`${this.timer}`, 430, 45)
    },



    checkPiggishCollisions() {
        let piggishFound = false

        this.allPiggish.forEach(eachPiggish => {
            const rect1 = { x: this.plate.platePos.x, y: this.plate.platePos.y, width: this.plate.plateSize.w, height: this.plate.plateSize.h }
            const rect2 = { x: eachPiggish.piggishPos.x, y: eachPiggish.piggishPos.y, width: eachPiggish.piggishSize.w, height: eachPiggish.piggishSize.h }

            if (rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.height + rect1.y > rect2.y) {
                piggishFound = true
            }
        })
        return piggishFound
    },

    drawGameOver() {
        this.ctx.fillStyle = 'rgba (0, 0, 0, 0.5)'
        this.ctx.fillRect(this.gameSize.w / 2 - 200, this.gameSize.h / 2 - 50, 400, 100)
        this.ctx.font = 'bold 25pt Menlo'
        this.ctx.fillStyle = 'black'
        this.ctx.fillText('YOU ARE FIRED!!!', 100, 315)

    },

    gameOver() {
        this.drawGameOver()
        clearInterval(this.interval)

    },

    updateClock() {

        if (this.timer === 0) {
            this.gameOver()
        } else {
            if (this.framesIndex % 33 === 0) {
                this.timer -= 1;
            }
        }
    },

    checkIngredientCollision() {
        let ingredientFound = false

        this.ingredients.forEach(eachIngredient => {
            const rect1 = { x: this.plate.platePos.x, y: this.plate.platePos.y, width: this.plate.plateSize.w, height: this.plate.plateSize.h }
            const rect2 = { x: eachIngredient.ingredientPos.x, y: eachIngredient.ingredientPos.y, width: eachIngredient.ingredientSize.w, height: eachIngredient.ingredientSize.h }

            if (rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.height + rect1.y > rect2.y) {
                ingredientFound = true
                const index = this.ingredients.indexOf(eachIngredient)
                this.ingredients.splice(index, 1)
                this.checkIngredient(eachIngredient.name)

            }
        })
        return ingredientFound
    },

    checkIngredient(eachIngredient) {

        if (eachIngredient === allBurgers[0].ingredients[0]) {
            // AUMENTAR IMAGEN DEL PLATO
            allBurgers[0].ingredients.shift()
        } else {
            this.plate.lives -= 1

        }
    },

    victory() {
        if (allBurgers[0].ingredients.length === 0) {
            clearInterval(this.interval)
            this.drawVictory()
        }
    },

    drawVictory() {
        this.ctx.fillStyle = 'rgba (0, 0, 0, 0.5)'
        this.ctx.fillRect(this.gameSize.w / 2 - 200, this.gameSize.h / 2 - 50, 400, 100)
        this.ctx.font = 'bold 25pt Menlo'
        this.ctx.fillStyle = 'black'
        this.ctx.fillText('BURGER READY!', 100, 315)
    },

    checkLives() {
        if (this.plate.lives < 0) {
            this.gameOver()
        }
    },

    drawLive() {
        if (this.plate.lives === 3) {

        }
    },

}


