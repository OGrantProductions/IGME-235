const lifeworld = {

    init(numCols, numRows) {
        this.numCols = numCols,
            this.numRows = numRows,
            this.world = this.buildArray();
        this.worldBuffer = this.buildArray();
        this.randomSetup();
    },

    buildArray() {
        let outerArray = [];
        for (let row = 0; row < this.numRows; row++) {
            let innerArray = [];
            for (let col = 0; col < this.numCols; col++) {
                innerArray.push(0);
            }
            outerArray.push(innerArray);
        }
        return outerArray;
    },

    randomSetup() {
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {
                this.world[row][col] = 0;
                if (Math.random() < .1) {
                    this.world[row][col] = 1;
                }
            }
        }
    },

    getLivingNeighbors(row, col) {
        let livingNeighbors = 0;
        // row and col should > than 0, if not return 0
        if (row <= 0 || col <= 0) {
            return 0;
        }

        // row and col should be < the length of the applicable array, minus 1. If not return 0
        if (row >= this.numRows - 1 || col >= this.numCols - 1) {
            return 0;
        }

        // count up how many neighbors are alive at N,NE,E,SE,S,SW,W,NW - use this.world[row][col-1] etc
        if (this.world[row - 1][col] > 0) { livingNeighbors++; } // N
        if (this.world[row - 1][col + 1] > 0) { livingNeighbors++; } // NE
        if (this.world[row][col + 1] > 0) { livingNeighbors++; } // E
        if (this.world[row + 1][col + 1] > 0) { livingNeighbors++; } // SE
        if (this.world[row + 1][col] > 0) { livingNeighbors++; } // S
        if (this.world[row + 1][col - 1] > 0) { livingNeighbors++; } // SW
        if (this.world[row][col - 1] > 0) { livingNeighbors++; } // W
        if (this.world[row - 1][col - 1] > 0) { livingNeighbors++; } // NW

        // return that sum
        return livingNeighbors;
    },

    step() {
        // nested for loop will call getLivingNeighbors() on each cell in this.world
        // Determine if that cell in the next generation should be alive, Wikipedia article: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
        // Put a 1 or zero into the right location in this.worldBuffer
        // when the looping is done, swap .world and .worldBuffer (use a temp variable to do so)

        let tempArray = this.worldBuffer;
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {
                let neighborsAlive = this.getLivingNeighbors(row, col);
                if (this.world[row][col] == 1 && neighborsAlive < 2) { // underpopulation
                    this.worldBuffer[row][col] = 0;
                }
                else if (this.world[row][col] == 1 && (neighborsAlive == 2 || neighborsAlive == 3)) { // next generation
                    this.worldBuffer[row][col] = 1;
                }
                else if (this.world[row][col] == 1 && neighborsAlive > 3) { // overpopulation
                    this.worldBuffer[row][col] = 0;
                }
                else if (this.world[row][col] == 0 && neighborsAlive == 3) { // reproduction
                    this.worldBuffer[row][col] = 1;
                }
                else if (this.world[row][col] == 0 && neighborsAlive != 3) { // dead cells stay dead
                    this.worldBuffer[row][col] = 0;
                }
            }
        }
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {
                this.world[row][col] = this.worldBuffer[row][col]; // populate array with new cell data
            }
        }
    }

} // end lifeworld literal