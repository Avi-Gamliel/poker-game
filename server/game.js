const rank = {
    'H': 1,
    'K-1P': 2,
    'K-2P': 3,
    'K-3': 4,
    'S': 5,
    'F': 6,
    'FH': 7,
    'K-4': 8,
    'SF': 9,
    'RF': 10,
}
class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }
}
class Deck {

    constructor() {
        this.deck = [];
    }

    createDeck() {
        const suits = ['C', 'H', 'S', 'D'];
        const faces = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
        for (let suit of suits) {
            for (let value of faces) {
                this.deck.push(new Card(suit, value));
            }
        }
        return this.deck;
    }

    shuffleDeck() {
        let counter = this.deck.length;
        let temp, i;
        while (counter) {
            i = Math.floor(Math.random() * counter--);
            temp = this.deck[counter];
            this.deck[counter] = this.deck[i];
            this.deck[i] = temp;
        }
        return this.deck;
    }

    oneCard() {
        let oneCard = this.deck.pop();
        return oneCard;
    }

    deal() {
        let hand = [];
        while (hand.length < 2) {
            hand.push(this.deck.pop());
        }
        return hand;
    }
}
class Player {
    constructor(num, name, hand, handwithboard, cash, chair, id, bet, action, bestHand, position, img, buy, numBuy, raise, toCall) {
        this.num = num;
        this.name = name;
        this.hand = hand;
        this.handwithboard = handwithboard;
        this.cash = cash;
        this.chair = chair;
        this.id = id;
        this.bet = bet;
        this.action = action;
        this.bestHand = bestHand;
        this.position = position;
        this.dealer = false;
        this.allIn = false;
        this.talk = false;
        this.img = img;
        this.buy = buy;
        this.numBuy = numBuy;
        this.raise = raise;
        this.toCall = toCall;
        this.roundBets = 0
    }
}
class Players {

    constructor() {
        this.players = [];
    }

    createPlayer(name, hand, cash, chair, id, check, img) {
        var length = this.players.length;
        if (length > 9) {
            console.error('You try to add more than 9 players');
        } else {
            this.players.push(new Player(length + 1, name, hand, '', cash, chair, id, 0, check, '', '', img, cash, 1))
        }
    }

    sitPlayer(name, sum, chair) {
        const player = this.players.filter(player => player.name === name);
        player[0].cash = sum;
        player[0].chair = chair;
    }

    buyMore(cash, name) {
        const player = this.players.filter(player => player.name === name);
        player[0].numBuy = player[0].numBuy + 1;
        player[0].buy = player[0].buy + cash;
        player[0].cash = Number(cash);
    }

    standPlayer(name) {
        this.players = this.players.filter(p => p.name !== name)
    }

    handleDealer() {

        let startGame = this.players.filter(x => x.dealer == true)
        if (startGame.length === 0) {

            this.players.forEach((player, i) => {
                if (this.players.length > 2) {
                    if (i === 0) {
                        player.dealer = true;
                    } else if (i === 1) {
                        player.position = 'S'
                    } else if (i === 2) {
                        player.position = 'B'
                    }
                } else {
                    if (i === 0) {
                        player.position = 'S'
                    } else if (i === 1) {
                        player.dealer = true;
                        player.position = 'B'
                    }
                }
            })

            this.players.forEach(player => {
                if (player.position !== 'B' && player.position !== 'S') {
                    player.position = ''
                }
            })

        } else {
            let dealerIndex = this.players.findIndex(x => x.dealer == true);
            let BigIndex = this.players.findIndex(x => x.position == 'B');
            let SmallIndex = this.players.findIndex(x => x.position == 'S');
            let length = this.players.length;
            if (length >= 2) {

                let indexDiller = dealerIndex + 1;
                let indexSmall = SmallIndex + 1;
                let indexBig = BigIndex + 1;

                if (indexDiller >= length) {
                    indexDiller = 0;
                }
                if (indexSmall >= length) {
                    indexSmall = 0;
                }
                if (indexBig >= length) {
                    indexBig = 0;
                }
                if (length > 2) {
                    this.players[indexDiller].dealer = true;
                    this.players[indexDiller].position = '';
                    this.players[dealerIndex].dealer = false;
                    this.players[dealerIndex].position = '';
                    this.players[indexSmall].dealer = false;
                    this.players[indexSmall].position = 'S';
                    this.players[indexBig].dealer = false;
                    this.players[indexBig].position = 'B';
                } else if (length === 2) {
                    this.players[dealerIndex].dealer = false;
                    this.players[indexSmall].dealer = false;
                    this.players[indexSmall].position = 'S';
                    this.players[indexBig].dealer = true;
                    this.players[indexBig].position = 'B';
                }

            }

            this.players.forEach(player => {
                if (player.position !== 'B' && player.position !== 'S') {
                    player.position = ''
                }
            })

        }
    }

}
class Round {

    constructor(big, small) {
        this.players = [];
        this.board = [];
        this.big = 0;
        this.small = 0;
        this.pot = { cash: 0, players: [], id: 'main', sidePot: [] };
        this.stage = '';
        this.bets = true;
        this.restart = false;
        this.lastmove = { name: null, move: null, cash: null, raise: 0 }
    }

    startGame(action) {
        this.restart = action;
    }

    makeBigSmall(big, small) {
        this.big = big;
        this.small = small;
    }

    addPlayers(players) {
        function sortPlayersByChair(players) {
            players.sort((a, b) => {
                return a.chair - b.chair;
            })
            return players;
        }

        const newPlayers = sortPlayersByChair(players)
        let Players = [...newPlayers]
        this.players = Players
    }

    Board(cards) {
        this.board.push(cards);
        this.players.forEach(player => {
            player.handwithboard = this.createHands(player.hand);
            player.bestHand = this.checkBestHand(player.handwithboard);
        })
    }

    updateStage(stage) {

        this.stage = stage;
        let IndexBig = this.players.findIndex(x => x.position === 'B')
        let IndexSmall = this.players.findIndex(x => x.position === 'S')

        let IndexAfter = IndexBig + 1;
        if (this.stage == 'pre-flop') {
            for (let i = 0; i < IndexAfter; i++) {
                let first = this.players.shift()
                this.players.push(first)
            }
        } else if (this.stage == 'flop' || this.stage == 'turn' || this.stage == 'river') {
            for (let i = 0; i < IndexSmall; i++) {
                let first = this.players.shift()
                this.players.push(first)
            }
        }
    }

    activeBets() {
        this.bets = true;
        this.players.forEach(player => {
            player.action = '';
            player.bet = 0;
            player.raise = 0;
        })
    }

    Flop(deck) {
        this.Board(deck.oneCard())
        this.Board(deck.oneCard())
        this.Board(deck.oneCard())
    }

    Turn(deck) {
        this.Board(deck.oneCard())
    }

    River(deck) {
        this.Board(deck.oneCard())
    }

    createHands(cards) {
        let hand = cards.concat(this.board);
        return hand;
    }

    dealCards(deck) {
        this.players.forEach(user => {
            function sortHand(hand) {
                hand.sort((a, b) => {
                    return a.value - b.value;
                })
                return hand;
            }
            user.hand = deck.deal()
            user.bestHand = sortHand(user.hand)
        });
    }

    checkBestHand(HAND) {

        function REST_CARD(rest) {
            let restSort = sortHand(rest)
            let finalRest;
            if (HAND.length == 6) {
                finalRest = restSort.slice(1, 5);
            } else if (HAND.length == 7) {
                finalRest = restSort.slice(2, 5);
            } else {
                finalRest = restSort
            }
            return finalRest;

        }

        function sortHand(hand) {
            hand.sort((a, b) => {
                return a.value - b.value;
            })
            return hand;
        }

        function checkColor(hand) {
            let suits = []
            for (let i = 0; i < hand.length; i++) {
                let index = suits.findIndex(x => x.suit == hand[i].suit)
                if (index !== -1) {
                    suits[index].count++;
                } else {
                    suits.push({ suit: hand[i].suit, count: 1 })
                }
            }
            return suits;
        }

        function checkDupliacte(hand) {
            let values = []
            for (let i = 0; i < hand.length; i++) {
                let index = values.findIndex(x => x.value == hand[i].value)
                if (index !== -1) {
                    values[index].count++;
                } else {
                    values.push({ value: hand[i].value, count: 1 })
                }
            }
            return values;
        }

        function findStraight(hand) {
            const newHand = [...hand];
            const sorthand = sortHand(newHand)
            let straight = false
            const Ace = sorthand.findIndex(x => x.value == 14)
            if (Ace !== -1) {
                sorthand.unshift({ suit: sorthand[Ace].suit, value: 1 })
            }
            let duplicate = checkDupliacte(sorthand)
            let Array = []
            let tempArray = []
            let CARDS = []
            for (let i = 0; i < duplicate.length; i++) {
                let next = i + 1;
                if (duplicate[next]) {
                    if (duplicate[i].value + 1 === duplicate[next].value) {
                        let find = tempArray.indexOf(duplicate[i])
                        if (find == -1) {
                            tempArray.push(duplicate[i])
                        }
                        tempArray.push(duplicate[next])
                    } else if (duplicate[i].value + 1 !== duplicate[next].value) {
                        Array.push(tempArray)
                        tempArray = [];
                    }
                } else {
                    Array.push(tempArray)
                    tempArray = [];
                }
            }

            Array.forEach(cards => {
                if (cards.length > 4) {
                    CARDS = cards.slice(-5)
                }
            })
            let Hand = []

            if (CARDS.length > 4) {

                if (CARDS[0].value === 1) {
                    CARDS[0].value = 14;
                }
                straight = true;
                for (let i = 0; i < 5; i++) {
                    let index = Hand.findIndex(x => x.value === CARDS[i].value);
                    let indexHand = HAND.findIndex(x => x.value === CARDS[i].value);
                    if (index == -1) {
                        Hand.push(HAND[indexHand])
                    }
                }
            }

            return {
                hand: Hand,
                straight
            };

        }

        const suitss = checkColor(HAND)
        const values = checkDupliacte(HAND)

        let filterFour = values.filter(x => x.count === 4)
        let filterThree = values.filter(x => x.count === 3)
        let filterTwo = values.filter(x => x.count === 2)
        const filterFlush = suitss.filter(x => x.count > 4)

        if (filterFlush.length > 0 && filterThree.length == 0) {

            const filterFlushCard = HAND.filter(x => x.suit === filterFlush[0].suit)
            const checkStrightFlush = findStraight(filterFlushCard);

            if (checkStrightFlush.straight) {

                if (checkStrightFlush.hand[checkStrightFlush.hand.length - 1].value == 14) {
                    return {
                        rank: 'RF',
                        hand: checkStrightFlush.hand
                    }
                } else {
                    return {
                        rank: 'SF',
                        hand: checkStrightFlush.hand
                    }
                }

            } else {
                const sorthand = sortHand(filterFlushCard);
                let newHand;
                if (sorthand.length == 5) {
                    newHand = sorthand;
                } else if (sorthand.length == 6) {
                    newHand = sorthand.slice(1, 6);
                } else if (sorthand.length == 7) {
                    newHand = sorthand.slice(2, 7);
                }
                return {
                    rank: 'F',
                    hand: newHand
                }
            }

        } else {


            if (filterFour.length > 0) {

                const newHand = HAND.filter(x => x.value == filterFour[0].value);
                const restHand = HAND.filter(x => x.value !== filterFour[0].value)
                const maxArray = []

                for (let card of restHand) {
                    maxArray.push(card.value)
                }

                const maxCard = Math.max(...maxArray);
                const index = restHand.findIndex(x => x.value === maxCard)
                newHand.push(restHand[index])

                return {
                    rank: 'K-4',
                    hand: newHand
                }

            } else if (filterThree.length > 0) {

                if (filterTwo.length > 0) {

                    if (filterTwo.length == 2) {

                        let pos;
                        let i = 0;
                        if (filterTwo[i].value > filterTwo[i + 1].value) {
                            pos = i
                        } else {
                            pos = i + 1
                        }

                        const three = HAND.filter(x => x.value === filterThree[0].value)
                        const two = HAND.filter(x => x.value == filterTwo[pos].value);
                        const newHand = three.concat(two);

                        return {
                            rank: 'FH',
                            hand: newHand
                        }

                    } else {
                        const three = HAND.filter(x => x.value === filterThree[0].value)
                        const two = HAND.filter(x => x.value == filterTwo[0].value);
                        const newHand = three.concat(two);
                        return {
                            rank: 'FH',
                            hand: newHand
                        }
                    }
                } else {

                    if (filterThree.length == 2) {
                        let i = 0;
                        let three, two;
                        if (filterThree[i].value > filterThree[i + 1].value) {
                            three = HAND.filter(x => x.value === filterThree[i].value)
                            two = HAND.filter(x => x.value === filterThree[i + 1].value);
                            two.pop();
                        } else {
                            three = HAND.filter(x => x.value === filterThree[i + 1].value)
                            two = HAND.filter(x => x.value === filterThree[i].value);
                            two.pop();
                        }
                        const newHand = three.concat(two);

                        return {
                            rank: 'FH',
                            hand: newHand
                        }

                    } else {
                        const checkStright = findStraight(HAND)

                        if (checkStright.straight) {
                            return {
                                rank: 'S',
                                hand: checkStright.hand
                            }
                        } else {
                            const three = HAND.filter(x => x.value === filterThree[0].value);
                            const rest = HAND.filter(x => x.value !== filterThree[0].value);

                            let finalRest = REST_CARD(rest)
                            three.push(...finalRest)
                            return {
                                rank: 'K-3',
                                hand: three
                            }
                        }
                    }
                }

            } else if (filterTwo.length > 0) {
                if (filterTwo.length == 1) {
                    const checkStright = findStraight(HAND)
                    if (checkStright.straight) {
                        return {
                            rank: 'S',
                            hand: checkStright.hand
                        }

                    } else {
                        const two = HAND.filter(x => x.value === filterTwo[0].value);
                        const rest = HAND.filter(x => x.value !== filterTwo[0].value);

                        const restSort = sortHand(rest);
                        let restFinal = REST_CARD(rest)
                        two.push(...restFinal)
                        return {
                            rank: 'K-1P',
                            hand: two
                        }
                    }

                } else if (filterTwo.length == 2) {
                    const checkStright = findStraight(HAND)

                    if (checkStright.straight) {
                        return {
                            rank: 'S',
                            hand: checkStright.hand
                        }
                    } else {
                        let two_1, two_2, rest;
                        let i = 0;
                        if (filterTwo[i].value > filterTwo[i + 1].value) {
                            two_1 = HAND.filter(x => x.value === filterTwo[i].value);
                            two_2 = HAND.filter(x => x.value === filterTwo[i + 1].value);
                            rest = HAND.filter(x => x.value !== filterTwo[i].value && x.value !== filterTwo[i + 1].value);

                        } else {
                            two_1 = HAND.filter(x => x.value === filterTwo[i + 1].value);
                            two_2 = HAND.filter(x => x.value === filterTwo[i].value);
                            rest = HAND.filter(x => x.value !== filterTwo[i].value && x.value !== filterTwo[i + 1].value);
                        }

                        const restSort = sortHand(rest)
                        const newHand = two_1.concat(two_2);
                        newHand.push(restSort[restSort.length - 1])
                        return {
                            rank: 'K-2P',
                            hand: newHand
                        }
                    }
                } else if (filterTwo.length == 3) {
                    const checkStright = findStraight(HAND)

                    if (checkStright.straight) {
                        return {
                            rank: 'S',
                            hand: checkStright.hand
                        }
                    } else {
                        const newSort = sortHand(filterTwo);
                        const newfilterTwo = newSort.slice(1, 3);
                        let two_1, two_2, rest;
                        let i = 0;
                        if (newfilterTwo[i].value > newfilterTwo[i + 1].value) {
                            two_1 = HAND.filter(x => x.value === newfilterTwo[i].value);
                            two_2 = HAND.filter(x => x.value === newfilterTwo[i + 1].value);
                            rest = HAND.filter(x => x.value !== newfilterTwo[i].value && x.value !== newfilterTwo[i + 1].value);

                        } else {
                            two_1 = HAND.filter(x => x.value === newfilterTwo[i + 1].value);
                            two_2 = HAND.filter(x => x.value === newfilterTwo[i].value);
                            rest = HAND.filter(x => x.value !== newfilterTwo[i].value && x.value !== newfilterTwo[i + 1].value);
                        }

                        const restSort = sortHand(rest)
                        const newHand = two_1.concat(two_2);
                        newHand.push(restSort[restSort.length - 1])
                        return {
                            rank: 'K-2P',
                            hand: newHand
                        }
                    }
                }
            } else {
                const checkStright = findStraight(HAND)

                if (checkStright.straight) {
                    return {
                        rank: 'S',
                        hand: checkStright.hand
                    }
                } else {
                    const sorthand = sortHand(HAND);
                    let finalRest;
                    if (HAND.length == 6) {
                        finalRest = sorthand.slice(1, 7);
                    } else if (HAND.length == 7) {
                        finalRest = sorthand.slice(2, 7);
                    } else {
                        finalRest = sorthand
                    }
                    return {
                        rank: 'H',
                        hand: finalRest
                    }
                }
            }

        }

    }

    SmallBig() {
        const big = this.players.findIndex(x => x.position == 'B')
        const small = this.players.findIndex(x => x.position == 'S')
        this.players[small].bet = this.small;
        this.players[small].roundBets = this.small;
        this.players[big].action = 'small';
        this.pot.players.push(this.players[small].name)

        this.players[big].bet = this.big;
        this.players[big].roundBets = this.big;
        this.players[big].action = 'big';
        this.pot.players.push(this.players[big].name)

        this.players[small].cash = this.players[small].cash - this.small;

        if (this.players[small].cash === 0) {
            this.players[small].allIn = true;
        }
        this.players[big].cash = this.players[big].cash - this.big;
        this.lastmove = { name: this.players[big].name, move: 'big', cash: this.big, raise: this.big }

        if (this.players[big].cash === 0) {
            this.players[big].allIn = true;
        }
        this.players[0].talk = true
    }

    checkAllIn(players) {
        const userLeft = players.filter(x => x.allIn !== true);
        if (userLeft.length > 1) {
            return false
        } else {
            const maxBet = Math.max.apply(Math, this.players.map(function (x) { return x.bet; }))
            if (maxBet > 0) {
                return false
            } else {
                return true
            }
        }
    }


    handleFold(name) {

        this.lastmove = { name: name, move: 'fold', cash: 0, raise: this.lastmove.raise }
        const checkIfExist = this.pot.players.filter(x => x === name)

        if (checkIfExist.length > 0) {
            this.pot.players = this.pot.players.filter(x => x !== name)
        }
        this.pot.sidePot.forEach(s => {
            s.players = s.players.filter(x => x !== name);
        })
        if (this.players[0].name === name) {
            this.pot.cash += this.players[0].bet;
        } else {
            const p = this.players.filter(x => x.name === name)
            if (p.length > 0) {
                this.pot.cash += p[0].bet;

            }
        }
        this.players = this.players.filter(x => x.name !== name)

    }

    handleRaise(cashRaise, name) {

        const player = this.players.filter(x => x.name === name)
        player[0].talk = false;
        player[0].bet += cashRaise;
        player[0].roundBets += cashRaise;
        let action;
        if (cashRaise === player[0].cash) {
            player[0].allIn = true;
            action = 'allin';
            this.pot.sidePot.push({ cash: player[0].bet + this.pot.cash, bet: player[0].roundBets, players: [player[0].name], id: this.pot.sidePot.length });
            this.pot.players = this.pot.players.filter(p => p !== player[0].name)
            this.pot.cash = 0;
        } else {
            action = 'raise';
            const checkIfExist = this.pot.players.filter(x => x === player[0].name)
            if (checkIfExist.length === 0) {
                this.pot.players = [player[0].name, ...this.pot.players]
            }
        }

        player[0].cash -= cashRaise;
        player[0].action = action;

        this.lastmove = { name: player[0].name, move: action, cash: player[0].bet, raise: this.lastmove.raise < player[0].bet ? player[0].bet : this.lastmove.raise }

        let first = this.players.shift()
        this.players.push(first)
        this.players[0].talk = true;
    }

    handleCall(cashCall, name) {

        const player = this.players.filter(x => x.name === name)

        if (player.length > 0) {
            const checkIfExist = this.pot.players.filter(x => x === player[0].name)
            player[0].talk = false;
            player[0].bet += cashCall;
            player[0].roundBets += cashCall;
            let action;

            if (this.lastmove.raise >= player[0].cash) {

                player[0].action = 'allin';
                player[0].allIn = true;
                action = 'allin';
                this.pot.sidePot.push({ cash: player[0].bet + this.pot.cash, bet: player[0].roundBets, players: [player[0].name], id: this.pot.sidePot.length });
                this.pot.players = this.pot.players.filter(p => p !== player[0].name)
                this.pot.cash = 0;
                if (this.pot.players.length === 1) {
                    const finPlayer = this.players.filter(p => p.name === this.pot.players[0])
                    if (finPlayer.length > 0) {
                        finPlayer[0].cash += this.pot.cash;
                        this.pot.cash = 0;
                        this.pot.players[0];
                    }

                }


            } else {
                player[0].action = 'call';
                action = 'call'
                if (checkIfExist.length === 0) {
                    this.pot.players = [player[0].name, ...this.pot.players]
                }
            }

            player[0].cash -= cashCall;

            this.lastmove = { name: player[0].name, move: action, cash: player[0].bet, raise: this.lastmove.raise }

            this.players[0].talk = false;
            let first = this.players.shift()
            this.players.push(first)
            this.players[0].talk = true;
        }
    }

    sortUsers(users) {
        users.sort((a, b) => {
            return a.bet - b.bet;
        })
        return users;
    }

    clearLastMove() {

        this.lastmove.raise = 0;
        let totalBets = 0;

        if (this.pot.sidePot.length > 0) {
            const checkBet = this.pot.sidePot.filter(x => x.bet > 0)
            if (checkBet.length > 0) {

                const sidePot = this.sortUsers(this.pot.sidePot)
                sidePot.forEach(s => {
                    this.players.forEach(p => {

                        if (p.name !== s.players[0]) {
                            if (s.bet <= p.roundBets) {
                                p.bet -= s.bet
                                p.roundBets -= s.bet;
                                s.cash += s.bet;
                                s.players.push(p.name);
                                const checkUser = sidePot.findIndex(x => x.players[0] === p.name);
                                if (checkUser !== -1) {
                                    sidePot[checkUser].bet -= s.bet;
                                    sidePot[checkUser].cash -= s.bet;
                                }
                            }
                        }

                    })

                    const find = this.players.filter(x => x.name === s.players[0])
                    if (find.length > 0) {
                        find[0].roundBets -= s.bet
                        s.bet -= s.bet
                    }
                })

            }


        }

        this.pot.sidePot = this.pot.sidePot.filter(s => s.cash !== 0);
        this.players.forEach(p => {
            if (p.roundBets > 0) {
                totalBets += p.bet
            }
            p.talk = false
            p.bet = 0;
            p.roundBets = 0;

        })
        this.pot.cash += totalBets
        if (this.pot.players.length === 1) {
            const player = this.players.filter(p => p.name === this.pot.players[0])
            if (player.length > 0) {
                player[0].cash += this.pot.cash
                this.pot.cash = 0;
            }
        }

        this.lastmove = { name: null, move: null, cash: null, raise: 0 }

    }

    checkRound() {
        if (this.players.length === 1) {
            return false
        } else {
            const filterAllIn = this.players.filter(x => x.allIn !== true)
            const filterBets = filterAllIn.every(x => x.bet === this.lastmove.raise);
            const filterActions = filterAllIn.filter(x => x.action === '');
            const findBig = filterAllIn.filter(x => x.action === 'big');
            if (filterAllIn.length === 1) {
                if (!filterBets || filterActions.length > 0 || findBig.length > 0) {
                    return true
                } else {
                    return false
                }
            } else if (filterAllIn.length > 1) {
                if (!filterBets || filterActions.length > 0 || findBig.length > 0) {
                    return true
                } else {
                    return false;
                }
            }
        }
    }

    handleCheck() {
        this.lastmove = { name: this.players[0].name, move: 'check', cash: this.players[0].bet, raise: this.lastmove.raise }
        const checkIfExist = this.pot.players.filter(x => x === this.players[0].name)

        if (checkIfExist.length === 0) {
            this.pot.players = [this.players[0].name, ...this.pot.players]
        }

        this.players[0].action = 'check'
        this.players[0].talk = false;
        let first = this.players.shift()
        this.players.push(first)
        this.players[0].talk = true;

    }

    makeMove(name, move, bet) {

        let player = this.players.filter(x => x.name === name);

        if (player.length === 0) {
            console.error("You try to make an action but there is an error: make sure thats the player's turn or check if the player is exist ");
        } else {

            const maxBet = Math.max.apply(Math, this.players.map(function (x) { return x.bet; }))
            let filterAllIn = this.players.filter(x => x.allIn !== true);

            if (player[0].allIn) {
                console.error('You tried to make a move to player that in all-in')
                player[0].action = 'all-in';
                this.players[0].talk = false;
                let first = this.players.shift()
                this.players.push(first)
                this.players[0].talk = true;
            }

            if (filterAllIn.length >= 1) {

                if (!player[0].allIn) {

                    if (move === 'check') {
                        if (player[0].bet !== maxBet) {
                            console.warn(`cannot make check need to add more ${maxBet - player[0].bet} cause there is a raise of ${maxBet}`);
                        } else {
                            let AllIn = false;
                            const toCall = maxBet - player[0].bet;
                            if (player[0].cash - toCall <= 0) {
                                AllIn = true;
                                player[0].allIn = true;
                            }
                            if (AllIn) {
                                player[0].bet += player[0].cash;
                                player[0].cash = 0;
                            } else {
                                player[0].bet = player[0].bet + toCall;
                                player[0].cash = player[0].cash - toCall;
                            }
                            player[0].action = 'call';
                            player[0].talk = false;

                            player[0].action = 'check';
                            player[0].talk = false;
                            let first = this.players.shift()

                            this.players.push(first)
                            this.players[0].talk = true;
                        }
                    } else if (move === 'call') {
                        let AllIn = false;
                        const toCall = maxBet - player[0].bet;
                        if (player[0].cash - toCall <= 0) {
                            AllIn = true;
                            player[0].allIn = true;
                        }
                        if (AllIn) {
                            player[0].bet += player[0].cash;
                            player[0].cash = 0;
                        } else {
                            player[0].bet = player[0].bet + toCall;
                            player[0].cash = player[0].cash - toCall;
                        }
                        player[0].action = 'call';
                        player[0].talk = false;

                        let first = this.players.shift()
                        this.players.push(first)
                        this.players[0].talk = true;


                    } else if (move === 'fold') {
                        const indexinPot = this.pot.players.findIndex(x => x === name);

                        if (indexinPot !== -1) {
                            this.pot.players = this.pot.players.filter(x => x !== name);
                        }

                        this.pot.sidePot.forEach(pot => {
                            const indexinPot = pot.players.findIndex(x => x === name);
                            if (indexinPot !== -1) {
                                pot.players = pot.players.filter(x => x !== name)
                            }

                        })
                        this.pot.cash += player[0].bet;
                        this.players = this.players.filter(x => x.name !== name);
                    } else if (move === 'raise') {
                        let AllIn = false;
                        player[0].action = 'raise';
                        if (player[0].cash - bet <= 0) {
                            AllIn = true;
                            player[0].allIn = true;
                        }
                        if (AllIn) {
                            player[0].bet += player[0].cash;
                            player[0].cash = 0;

                        } else {
                            player[0].cash = player[0].cash - bet;
                            player[0].bet = player[0].bet + bet;
                            player[0].raise = bet;
                        }
                        player[0].talk = false;

                        let first = this.players.shift()
                        this.players.push(first);
                        this.players[0].talk = true;

                    }

                    const maxBetAfter = Math.max.apply(Math, this.players.map(function (x) { return x.bet; }))
                    const filterNotAllin = this.players.filter(player => player.allIn !== true);
                    const checkAfter = filterNotAllin.every(x => x.bet === maxBetAfter)
                    const CheckActions = filterNotAllin.every(x => x.action !== '')
                    if (checkAfter && CheckActions || checkAfter && filterNotAllin.length == 1) {
                        if (this.players.length > 1) {
                            this.bets = false;
                            let findAllIn = this.players.filter(player => player.cash == 0);

                            if (findAllIn.length > 0) {
                                function sortUsers(users) {
                                    users.sort((a, b) => {
                                        return a.bet - b.bet;
                                    })
                                    return users;
                                }
                                function sortUsersCash(users) {
                                    users.sort((a, b) => {
                                        return a.cash - b.cash;
                                    })
                                    return users;
                                }
                                const sortAllIn = sortUsers(findAllIn);

                                sortAllIn.forEach((player, i) => {
                                    let Bet = player.bet;
                                    let users = [];
                                    let sum = 0;
                                    const tempPlayers = [...this.players];
                                    const filterAllIn = tempPlayers.filter(x => x.bet > 0)
                                    const sortTempPlayers = sortUsers(filterAllIn);

                                    sortTempPlayers.forEach(p => {
                                        if (p.bet > 0) {
                                            sum += Bet
                                            users.push(p.name)
                                        }
                                    })
                                    this.players.forEach(player => {

                                        if (player.bet > 0) {
                                            player.bet -= Bet;

                                        }
                                    })


                                    this.pot.sidePot.push({ cash: sum + this.pot.cash, players: users, id: i })
                                    this.pot.cash = 0;
                                    this.pot.players = []

                                })
                                let restUser = this.players.filter(x => x.cash > 0);

                                if (restUser.length > 0) {
                                    restUser.forEach(user => {
                                        this.pot.cash += user.bet;
                                        this.pot.players.push(user.name);
                                    })
                                }
                                this.bets = false;

                            } else {
                                this.players.forEach(player => {
                                    this.pot.cash += player.bet;
                                    const indexPotIndex = this.pot.players.findIndex(x => x == player.name)
                                    if (indexPotIndex == -1) {
                                        this.pot.players.push(player.name)
                                    }
                                })

                                this.bets = false;

                            }
                        } else {
                            this.bets = false;
                            if (this.pot.sidePot.length === 0) {
                                this.players[0].cash = this.players[0].cash + this.pot.cash
                            }
                        }
                    }
                }
            } else {
                console.error('You tried to make a move but there is no player with cash in this round')
                this.bets = false;
                let first = this.players.shift()
                this.players.push(first)
                this.players[0].talk = true;
            }
        }
    }

    checkWinner() {
        let totalWinners = []
        function checkWinnersInPots(pot, players) {

            let winners = {}
            let users = []

            pot.players.forEach(player => {
                let user = players.filter(x => x.name == player);
                users.push(user[0])
            })

            let winner = [users[0]];

            if (users.length !== 1) {
                for (let i = 1; i < users.length; i++) {
                    const Solve_Winner = solve(winner[0].bestHand, users[i].bestHand)
                    if (Solve_Winner === 2) {
                        winner = [users[i]];
                    } else if (Solve_Winner === 'split') {
                        winner.push(users[i])
                    }
                }
            }

            winners.id = pot.id;
            winners.winner = winner;
            return winners;
        }
        if (this.pot.sidePot.length > 0) {

            this.pot.sidePot.forEach(pot => {
                const newPlayers = [...this.players];
                const PLAYERS = [];
                newPlayers.forEach(player => {
                    const playerCurrent = pot.players.findIndex(x => x === player.name);
                    if (playerCurrent !== -1) {
                        PLAYERS.push(player)
                    }
                })

                const Winners = checkWinnersInPots(pot, PLAYERS)
                totalWinners.push(Winners)
            })

            const Winners = checkWinnersInPots(this.pot, this.players)
            totalWinners.push(Winners)
            return totalWinners;

        } else {
            const Winners = checkWinnersInPots(this.pot, this.players)
            totalWinners.push(Winners)
            return totalWinners;
        }
    }

    handleWinners(pots) {

        pots.forEach(pot => {

            let potId = pot.id;
            let totalWin = pot.winner.length;
            let cash = 0;
            let total = 0;

            if (potId === 'main') {
                cash += this.pot.cash;
                total = cash / totalWin;
            } else {
                let findPot = this.pot.sidePot.filter(x => x.id === potId)
                cash += findPot[0].cash;
                total = cash / totalWin;

            }
            pot.winner.forEach(player => {
                if (player) {
                    let index = this.players.findIndex(x => x.name === player.name)
                    this.players[index].cash += total;
                    this.players[index].bet = 0;
                }
            });
        })
    }

    restartRound(players) {

        this.players.forEach(player => {
            let filterPlayer = players.filter(p => p.name === player.name);
            filterPlayer.cash = player.cash
        });

        this.pot = { cash: 0, players: [], id: 'main', sidePot: [] };
        let newPlayers = [...players];
        newPlayers.forEach(player => {
            player.hand = [];
            player.handwithboard = [];
            player.bet = 0;
            player.action = '';
            player.bestHand = [];
            player.allIn = false;
        })

        this.players = newPlayers;
        this.board = [];
        this.big = 0;
        this.small = 0;
        this.pot = { cash: 0, players: [], id: 'main', sidePot: [] };
        this.stage = '';
        this.bets = true;
        this.restart = false;

    }

}

function solve(hand1, hand2) {

    if (rank[hand1.rank] > rank[hand2.rank]) {
        return 1;
    } else if (rank[hand1.rank] < rank[hand2.rank]) {
        return 2
    } else {

        function checkLastCard(hand1, hand2) {
            let last = hand1.hand.length - 1;
            if (hand1.hand[last].value > hand2.hand[last].value) {
                return 1;
            } else if (hand1.hand[last].value < hand2.hand[last].value) {
                return 2
            } else {
                return 'split'
            }
        }

        function compareEqualHands(hand1, hand2, type) {
            if (hand1.hand[1].value > hand2.hand[1].value || hand1.hand[3].value > hand2.hand[3].value) {
                return 1;
            } else if (hand1.hand[1].value < hand2.hand[1].value || hand1.hand[3].value < hand2.hand[3].value) {
                return 2
            } else {
                const winner = compareHighCard(hand1, hand2, type)
                return winner;
            }
        }

        function threeKinds(hand1, hand2, type) {


            if (hand1.hand[1].value > hand2.hand[1].value) {
                return 1;
            } else if (hand1.hand[1].value < hand2.hand[1].value) {
                return 2
            } else {
                const winner = compareHighCard(hand1, hand2, type)
                return winner;
            }

        }
        function compareHighCard(hand1, hand2, type) {

            let TYPE = 0;
            if (type == 'H') {
                TYPE = 5
            } else if (type == 'K-1P') {
                TYPE = 3;
            } else if (type == 'K-3' || type == 'K-2P') {
                TYPE = 2;
            }
            for (let i = 0; i < TYPE; i++) {
                let last = hand1.hand.length - i - 1;
                if (hand1.hand[last].value > hand2.hand[last].value) {
                    return 1;
                    break;
                } else if (hand1.hand[last].value < hand2.hand[last].value) {
                    return 2
                    break;
                } else if (hand1.hand[last].value == hand2.hand[last].value) {
                    if (last === 5 - TYPE) {
                        return 'split'
                    } else {
                        continue;
                    }
                }
            }

        }

        if (hand1.rank == 'H') {
            const winner = compareHighCard(hand1, hand2, hand1.rank)
            return winner;
        } else if (hand1.rank == 'K-1P') {


            //  if it pair
            const winner = threeKinds(hand1, hand2, hand1.rank)

            return winner;
        } else if (hand1.rank == 'K-2P') {

            //  if it pair
            const winner = compareEqualHands(hand1, hand2, 'K-2P')
            return winner;
        } else if (hand1.rank == 'K-3') {


            // if it three
            const winner = threeKinds(hand1, hand2, 'K-3')
            return winner

        } else if (hand1.rank == 'S') {
            // if it straight
            const winner = checkLastCard(hand1, hand2)
            return winner

        } else if (hand1.rank == 'FH') {

            // if it full
            const winner = threeKinds(hand1, hand2, 'FH')
            return winner

        } else if (hand1.rank == 'F') {


            // if its flush 
            const winner = checkLastCard(hand1, hand2)
            return winner;
        } else if (hand1.rank == 'K-4') {

            // if its four
            const winner = checkLastCard(hand1, hand2)
            return winner;
        } else if (hand1.rank == 'SF') {

            // if its strightflush 
            const winner = checkLastCard(hand1, hand2)
            return winner;
        } else if (hand1.rank == 'RF') {

            // if it royal flush
            const winner = checkLastCard(hand1, hand2)
            return winner;
        }
    }
}


module.exports = { Deck, Players, Round, Player, Round, solve, rank }