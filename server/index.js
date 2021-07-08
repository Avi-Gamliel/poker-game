const dotenv = require('dotenv')
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const path = require('path');
const { Round, Deck, Players, Player, solve, rank } = require('./game.js');

dotenv.config();
global.rooms = {};
global.socketToRoom = {};
global.roomsPots = {};
global.roomPlayers = {};
global.rounds = {};

const main = io.of('/lobby');

main.on('connection', socket => {

    socket.on('check-join-room', roomID => {
        const exist = rooms[roomID]
        if (exist === undefined) {
            socket.emit('answer-join-room', false)
        } else {
            socket.emit('answer-join-room', true)
        }
    })

    socket.on('check-create-room', roomID => {
        const exist = rooms[roomID]
        if (exist === undefined) {
            socket.emit('answer-create-room', false)
        } else {
            socket.emit('answer-create-room', true)
        }
    })

})

const ROOM = io.of('/room');
ROOM.on('connection', socket => {


    function activeUser(ROUND, socketid, room) {

        const THIS_ROUND = ROUND.round;

        const ROUND_PLAYERS = THIS_ROUND.players;
        const BETS = THIS_ROUND.bets;
        const STAGE = THIS_ROUND.stage;
        const LAST_MOVE = THIS_ROUND.lastmove;

        if (ROUND_PLAYERS[0].cash === 0) {
            let first = ROUND_PLAYERS.shift()
            ROUND_PLAYERS.push(first)
            ROUND_PLAYERS[0].talk = true;
        }

        const TALK_CHAIR = ROUND_PLAYERS[0].chair;
        const TALK_NAME = ROUND_PLAYERS[0].name;
        const CHECK_FOLD = ROUND_PLAYERS.findIndex(x => x.name == LAST_MOVE.name)

        let tempRoom = [...rooms[room]];

        roomPlayers[room].players.forEach((player, i) => {
            if (player.id == socket.id) {
                socket.emit('activeUser', player, TALK_CHAIR, LAST_MOVE, STAGE, TALK_NAME)
            } else {
                socket.to(player.id).emit('activeUser', player, TALK_CHAIR, LAST_MOVE, STAGE, TALK_NAME)
            }
            tempRoom = tempRoom.filter(id => id.id !== player.id)

        })
        tempRoom.forEach(p => {
            socket.to(p.id).emit('activeUser', '', TALK_CHAIR, LAST_MOVE, STAGE, TALK_NAME)
        })

        if (BETS) {
            return false
        } else {
            return true
        }

    }

    function makeBoard(ROUND, SOCKET_ID, room_id, MainPlayers, checkAllin) {

        const CHANGE_STAGE = async (stage, round, roomID, pot, board, players, deck, socket, ROUND, MainPlayers, activePlay) => {

            round.updateStage(stage);

            if (stage === 'flop') {
                if (activePlay) {
                    round.Flop(deck);
                } else {
                    round.Flop(deck);
                    round.Turn(deck);
                    round.River(deck);
                }
            } else if (stage === 'turn') {

                if (activePlay) {
                    round.Turn(deck);
                } else {
                    round.Turn(deck);
                    round.River(deck);
                }

            } else if (stage === 'river') {

                if (activePlay) {
                    round.River(deck);
                } else {
                    round.River(deck);
                }
            }

            socket.in(roomID).emit('update card and pot', pot, board, players, stage, checkAllin)
            socket.emit('update card and pot', pot, board, players, stage, checkAllin)

            if (!activePlay) {

                if (round.pot.players.length == 1) {

                    round.pot.cash = 0;
                    round.pot.players = [];
                }

                const winner = round.checkWinner();
                round.handleWinners(winner);
                socket.emit("handle finish game", winner, THIS_ROUND)
                socket.in(room_id).emit("handle finish game", winner, THIS_ROUND)

            }

            if (!checkAllin) {
                round.activeBets();
            }

        }

        const THIS_ROUND = ROUND.round;
        const POT = THIS_ROUND.pot;
        const BOARD = THIS_ROUND.board;
        const STAGE = THIS_ROUND.stage;
        const ROUND_PLAYERS = THIS_ROUND.players;
        const playersGame = []

        ROUND_PLAYERS.forEach(player => {
            playersGame.push({ chair: player.chair, action: player.action, name: player.name, cash: player.cash })
        })

        if (THIS_ROUND.pot.players.length > 1) {

            if (STAGE == 'pre-flop') {
                CHANGE_STAGE('flop', THIS_ROUND, room_id, POT, BOARD, playersGame, ROUND.deck, socket, ROUND, MainPlayers, true)
                return true;
            } else if (STAGE == 'flop') {
                CHANGE_STAGE('turn', THIS_ROUND, room_id, POT, BOARD, playersGame, ROUND.deck, socket, ROUND, MainPlayers, true)
                return true;
            } else if (STAGE == 'turn') {
                CHANGE_STAGE('river', THIS_ROUND, room_id, POT, BOARD, playersGame, ROUND.deck, socket, ROUND, MainPlayers, true)
                return true;
            } else if (STAGE == 'river') {

                socket.in(room_id).emit('update card and pot', POT, BOARD, playersGame, STAGE)
                socket.emit('update card and pot', POT, BOARD, playersGame, STAGE)

                const winner = THIS_ROUND.checkWinner();
                THIS_ROUND.handleWinners(winner);

                socket.emit("handle finish game", winner, THIS_ROUND)
                socket.in(room_id).emit("handle finish game", winner, THIS_ROUND)

                THIS_ROUND.startGame(true)
                THIS_ROUND.restartRound(MainPlayers.players);

            }

        } else {

            if (STAGE == 'pre-flop') {
                CHANGE_STAGE('flop', THIS_ROUND, room_id, POT, BOARD, playersGame, ROUND.deck, socket, ROUND, MainPlayers, false)
                return false;
            } else if (STAGE == 'flop') {
                CHANGE_STAGE('turn', THIS_ROUND, room_id, POT, BOARD, playersGame, ROUND.deck, socket, ROUND, MainPlayers, false)
                return false;
            } else if (STAGE == 'turn') {
                CHANGE_STAGE('river', THIS_ROUND, room_id, POT, BOARD, playersGame, ROUND.deck, socket, ROUND, MainPlayers, false)
                return false;
            } else if (STAGE == 'river') {

                socket.in(room_id).emit('update card and pot', POT, BOARD, playersGame, STAGE)
                socket.emit('update card and pot', POT, BOARD, playersGame, STAGE)

                const winner = THIS_ROUND.checkWinner();
                THIS_ROUND.handleWinners(winner);

                socket.emit("handle finish game", winner, THIS_ROUND)
                socket.in(room_id).emit("handle finish game", winner, THIS_ROUND)

                THIS_ROUND.startGame(true)
                THIS_ROUND.restartRound(MainPlayers.players);

            }
        }
    }

    function updateUser(ROUND, SOCKET_ID, room_id, MainPlayers) {

        const THIS_ROUND = ROUND.round;
        const POT = THIS_ROUND.pot;
        const BOARD = THIS_ROUND.board;
        const BETS = THIS_ROUND.bets;
        const STAGE = THIS_ROUND.stage;
        const ROUND_PLAYERS = THIS_ROUND.players;

        if (ROUND_PLAYERS.length == 1) {
            socket.emit("handleFinishGame", ROUND_PLAYERS[0], THIS_ROUND, 'fold')
            socket.in(room_id).emit("handleFinishGame", ROUND_PLAYERS[0], THIS_ROUND, 'fold')

            THIS_ROUND.startGame(true)
            THIS_ROUND.restartRound(MainPlayers.players);

        } else {
            let LAST_PLAYER;
            const maxBet = Math.max.apply(Math, ROUND_PLAYERS.map(function (x) { return x.bet; }))
            LAST_PLAYER = ROUND_PLAYERS[ROUND_PLAYERS.length - 1];

            const lastMove = {
                chair: LAST_PLAYER.chair,
                bet: LAST_PLAYER.bet,
                action: LAST_PLAYER.action,
                cash: LAST_PLAYER.cash,
                name: LAST_PLAYER.name,
                raise: LAST_PLAYER.raise,
                maxBet: maxBet
            }

            ROUND_PLAYERS.forEach((player, i) => {
                if (player.id == socket.id) {
                    socket.emit('update last move', lastMove, STAGE)
                } else {
                    socket.to(player.id).emit('update last move', lastMove, STAGE)
                }
            })
        }

    }

    const updateDataPlayers = (PLAYERS) => {

        const playerData = []

        PLAYERS.forEach(player => {
            playerData.push({ chair: player.chair, position: player.position, dealer: player.dealer, name: player.name, cash: player.cash, bet: player.bet })
        })
        playerData.forEach(user => {
            let currentPlayer = PLAYERS.filter(p => p.chair === user.chair)
            let index = PLAYERS.findIndex(x => x.chair === user.chair)
            if (currentPlayer[0].id === socket.id) {
                socket.emit('update-players-data', playerData, PLAYERS[index].hand, Number(PLAYERS[index].chair))
            } else {
                socket.to(currentPlayer[0].id).emit('update-players-data', playerData, PLAYERS[index].hand, PLAYERS[index].chair)
            }
        });

    }

    socket.on('join-room', (name, cash, roomID, bigSmall, players, bets) => {
        socket.join(roomID)
        socket.nickname = name;
        let chair;
        const userDetail = {
            id: socket.id,
            name: name,
            cash: cash
        }
        if (rooms[roomID]) {
            const existUser = rooms[roomID].find(x => x.name == name);
            if (!existUser) {
                rooms[roomID].push(userDetail);
                socketToRoom[socket.id] = roomID;
            } else {
                const filter = rooms[roomID].filter(x => x.name !== name);
                const checkUser = rooms[roomID].filter(x => x.name === name);
                if (checkUser[0].admin) {
                    rooms[roomID] = [...filter, { ...userDetail, admin: true }]
                } else {
                    rooms[roomID] = [...filter, userDetail]
                }
                socketToRoom[socket.id] = roomID;
            }
        } else {

            roomsPots[roomID] = bigSmall;
            rooms[roomID] = [{ ...userDetail, admin: true }]
            socketToRoom[socket.id] = roomID;
        }
        socket.in(roomID).emit('visitor', rooms[roomID].length, roomsPots[roomID])
        socket.emit('visitor', rooms[roomID].length, roomsPots[roomID])
        if (rounds[roomID]) {

            const exitPlayer = rounds[roomID].round.players.filter(p => p.name === name)
            let players = []
            const data = rounds[roomID].round.players

            data.forEach(p => {
                const roomPlayer = rounds[roomID].round.players.filter(x => x.name === p.name)
                players = [...players, {
                    name: p.name,
                    chair: p.chair,
                    position: p.position,
                    cash: p.cash,
                    cards: [{ suit: null, value: null }, { suit: null, value: null }],
                    bet: p.bet,
                    img: p.img,
                    active: p.active,
                    talk: p.talk,
                    allIn: p.allIn,
                    action: p.action,
                    numBuy: p.numBuy,
                    buy: p.buy,
                }]

            })

            if (exitPlayer.length === 0) {
                socket.emit('sit Players visit', players, rounds[roomID].round.board, rounds[roomID].round.pot)
            }

        } else {
            if (roomPlayers[roomID]) {
                const exitPlayer = roomPlayers[roomID].players.filter(p => p.name === name)
                let players = []
                const data = roomPlayers[roomID].players
                data.forEach(p => {
                    players = [...players, {
                        name: p.name,
                        chair: p.chair,
                        position: p.position,
                        cash: p.cash,
                        cards: [{ suit: null, value: null }, { suit: null, value: null }],
                        bet: p.bet,
                        img: p.img,
                        numBuy: p.numBuy,
                        buy: p.buy,
                    }]
                })

                if (exitPlayer.length === 0) {
                    socket.emit('sit Players visit', players)
                }
            }
        }
    })

    socket.on('acceptTime', (room) => {
        socket.emit('start-timer')
        socket.in(room).emit('start-timer')
    })

    socket.on('sit-player', (name, cash, chair, room, img) => {
        if (roomPlayers[room]) {
            const existPlayer = roomPlayers[room].players.find(x => x.name == name);
            if (!existPlayer) {
                roomPlayers[room].createPlayer(name, '', Number(cash), 0, socket.id, '', img)
                roomPlayers[room].sitPlayer(name, Number(cash), chair);
            } else {
                roomPlayers[room].standPlayer(name);
                roomPlayers[room].createPlayer(name, '', Number(cash), 0, socket.id, '', img)
                roomPlayers[room].sitPlayer(name, Number(cash), chair)
            }
        } else {
            roomPlayers[room] = new Players();
            roomPlayers[room].createPlayer(name, '', Number(cash), 0, socket.id, '', img)
            roomPlayers[room].sitPlayer(name, Number(cash), chair)
        }

        const userData = []
        roomPlayers[room].players.forEach(p => {
            userData.push({ name: p.name, cash: p.cash, chair: p.chair, img: p.img, numBuy: p.numBuy, buy: p.buy })
        });
        socket.in(room).emit('users-sits', userData, chair, name, true)
        socket.emit('current-user-sit', userData, chair, name, false)
    })

    socket.on('player stand', (name, room) => {

        if (rounds[room]) {
            if (rounds[room].round.players[0].name === name) {
                rounds[room].round.handleFold(name);

            } else {
                rounds[room].round.handleFold(name);
            }

        } else {

        }
        roomPlayers[room].players = roomPlayers[room].players.filter(player => player.id !== socket.id)
        if (roomPlayers[room].players.length === 0) {
            delete roomPlayers[room]
        }

        if (rounds[room]) {
            rounds[room].round.players = rounds[room].round.players.filter(player => player.id !== socket.id)
            if (rounds[room].round.players.length === 0) {
                delete rounds[room]
            }
        }
        socket.in(room).emit('update stand', name)
        socket.emit('update stand', name)
        const check = rounds[room].round.checkRound()

        if (check) {
            activeUser(rounds[room], socket.id, room, roomPlayers[room],)
        } else {
            const first = activeUser(rounds[room], socket.id, room, roomPlayers[room])
            rounds[room].round.clearLastMove()
            const board = makeBoard(rounds[room], socket.id, room, roomPlayers[room])
            if (board) {
                const res = activeUser(rounds[room], socket.id, room, roomPlayers[room])
            }
        }


    })

    socket.on('askTime', data => {
        socket.in(data.room_id).emit('ask-time', data)
        socket.emit('ask-time', data)
    })

    socket.on('start-game', room => {

        rounds[room] = { round: new Round() };
        rounds[room].deck = new Deck();
        rounds[room].deck.createDeck();
        rounds[room].deck.shuffleDeck();
        const newPlayer = roomPlayers[room].players.filter(x => x.cash > 0)
        rounds[room].round.addPlayers(newPlayer);
        rounds[room].round.dealCards(rounds[room].deck);

        const checkPlayersCash = rounds[room].round.players.filter(x => x.cash > 0);

        if (checkPlayersCash.length > 1) {
            roomPlayers[room].handleDealer();
            rounds[room].round.activeBets();
            let SMALL = 50;
            let BIG = 100;
            if (roomsPots[room].small > 0 || roomsPots[room].big > 0) {
                SMALL = roomsPots[room].small;
                BIG = roomsPots[room].big;
            }
            rounds[room].round.makeBigSmall(BIG, SMALL);
            rounds[room].round.SmallBig();
            rounds[room].round.updateStage('pre-flop');
            const PLAYERS = rounds[room].round.players;
            updateDataPlayers(PLAYERS)
            activeUser(rounds[room], socket.id, room, roomPlayers[room])
        }

    })

    socket.on('butMoreCash', (data) => {
        socket.in(data.room_id).emit('ask money', data.cash, data.name)
        socket.emit('ask money', data.cash, data.name)
    })

    socket.on('reject buy', (name, cash, id) => {
        const playerRooms = rooms[id].filter(p => p.name === name);
        const playerRoomPlayers = roomPlayers[id].players.filter(p => p.name === name);
        if (playerRooms.lengt > 0) {
            playerRooms[0].cash += cash;
        }
        if (playerRoomPlayers.length > 0) {
            playerRoomPlayers[0].cash += cash;
        }
        socket.in(id).emit('player reject cash', playerRoomPlayers[0].name, cash)
        socket.emit('player reject cash', playerRoomPlayers[0].name, cash)
    })

    socket.on('accept buy', (name, cash, id) => {
        const playerRooms = rooms[id].filter(p => p.name === name);
        const playerRoomPlayers = roomPlayers[id].players.filter(p => p.name === name);
        if (playerRooms.lengt > 0) {
            playerRooms[0].cash += cash;
        }
        if (playerRoomPlayers.length > 0) {
            playerRoomPlayers[0].cash += cash;
        }
        socket.in(id).emit('player buy cash', playerRoomPlayers[0].name, cash)
        socket.emit('player buy cash', playerRoomPlayers[0].name, cash)
    })

    socket.on('clear-game', (room) => {
        if (rounds[room]) {
            rounds[room].round.pot = { cash: 0, players: [], id: 'main', sidePot: [] };
            rounds[room].round.stage = '';
            rounds[room].round.players.forEach(p => {
                p.allIn = false
            })
            socket.in(room).emit('clear-game')
            socket.emit('clear-game')
        }
    })

    socket.on('player action', async (data) => {

        const id = data.id;
        if (data.name === 'fold') {
            rounds[id].round.handleFold(data.playerName);
        } else if (data.name === 'check') {
            rounds[id].round.handleCheck();
        } else if (data.name === 'call') {
            rounds[id].round.handleCall(Number(data.cash), data.playerName);
        } else if (data.name === 'raise') {
            rounds[id].round.handleRaise(Number(data.cash), data.playerName);
        }
        const check = rounds[id].round.checkRound()

        if (check) {
            activeUser(rounds[id], socket.id, id, roomPlayers[id],)
        } else {
            const first = await activeUser(rounds[id], socket.id, id, roomPlayers[id])
            rounds[id].round.clearLastMove()
            const board = await makeBoard(rounds[id], socket.id, id, roomPlayers[id])
            if (board) {
                const res = await activeUser(rounds[id], socket.id, id, roomPlayers[id])
            }
        }

    })

    socket.on('disconnect', () => {
        delete socketToRoom[socket.id]
    })

    socket.on('exist-room', (name, room) => {

        socket.in(room).emit('user-left', name)

        if (rooms[room]) {

            const user = rooms[room].filter(x => x.name === name);
            if (roomPlayers[room]) {
                roomPlayers[room].players = roomPlayers[room].players.filter(x => x.name !== name);
                if (rounds[room]) {
                    rounds[room].round.players = rounds[room].round.players.filter(x => x.name !== name);
                }
                if (roomPlayers[room].players.length === 0) {
                    delete roomPlayers[room]
                    delete rounds[room]
                }
            }

            if (user.length > 0) {
                const id = user[0].id;
                rooms[room] = rooms[room].filter(x => x.id !== id);
                delete socketToRoom[id];
                if (rooms[room].length === 0) {
                    delete rooms[room]
                    delete roomsPots[room]
                }
            }

        }

        socket.leave(room);

    })

    socket.on('close-room', (id) => {
        socket.in(id).emit('close room')
        socket.emit('close room')
    })

})

if (process.env.PROD) {
    app.use(express.static(path.join(__dirname, './client/build')))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, './client/build/index.html'))
    })
}

const ADMIN = io.of('/admin');
ADMIN.on('connection', socket => {
    socket.emit('join', { rooms, socketToRoom, roomsPots, roomPlayers, rounds })
})

const port = process.env.PORT || 6007;

server.listen(port, () => console.log(`server is running on port: ${port}`));