const initialzeState = {
    admin: null,
    player: { num: 0, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false },
    players: [{ num: 1, name: '', cards: [], cash: 0, bet: 0, buy: 0, toCall: 0, start: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false },
    { num: 2, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false },
    { num: 3, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false },
    { num: 4, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false },
    { num: 5, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false },
    { num: 6, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false },
    { num: 7, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false },
    { num: 8, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false },
    { num: 9, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false }],
    id: null,
    chair: 0,
    bigSmall: { small: 0, big: 0 },
    talk: false,
    bets: false,
    status: false,
    game: { stage: null, pot: 0, board: [], players: [], sidePots: [] },
    asks_buy: [],
    lastMove: null,
    time: false,
    start: false
}

const roomReducer = (state = initialzeState, action) => {

    switch (action.type) {

        case 'JOIN_ROOM':

            const dataJoin = action.payload;
            state.player.name = dataJoin.name;
            state.player.cash = dataJoin.cash;
            state.id = dataJoin.roomId;

            if (dataJoin.big_small) {
                state.admin = dataJoin.admin
                state.bigSmall = dataJoin.big_small
            }

            return { ...state };

        case 'SIT_PLAYER':
            const newPlayers = state.players;
            const USERS = action.payload.users.filter(x => x.name !== state.player.name);

            USERS.forEach(player => {
                let currentUser;

                if (state.player.chair > 0) {
                    let rest = 6 - state.player.chair;
                    let T = Number(player.chair) + Number(rest);
                    let newChair;
                    if (T <= 0) {
                        newChair = T + 9
                    } else if (T > 9) {
                        newChair = T - 9
                    } else if (0 < T < 9) {
                        newChair = T
                    }
                    currentUser = newChair;
                } else {
                    currentUser = player.chair;
                }

                const check = newPlayers.findIndex(x => x.name === player.name);

                if (check !== -1) {
                    newPlayers[check] = { num: check + 1, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null }
                }

                newPlayers[Number(currentUser) - 1].name = player.name;
                newPlayers[Number(currentUser) - 1].cash = player.cash;
                newPlayers[Number(currentUser) - 1].img = player.img;
                newPlayers[Number(currentUser) - 1].numBuy = player.numBuy;
                newPlayers[Number(currentUser) - 1].buy = player.buy;
                newPlayers[Number(currentUser) - 1].start = player.cash;
                newPlayers[Number(currentUser) - 1].chair = player.chair;
                newPlayers[Number(currentUser) - 1].active = true;

            })


            state.players = newPlayers;

            return { ...state };

        case 'SIT_CURRENT_PLAYER':

            const USERS_TO_SIT = action.payload.users;
            let rest;
            const NEW_USER_SIT = USERS_TO_SIT.findIndex(x => x.name === state.player.name);
            let newChair = 0;

            if (NEW_USER_SIT !== -1) {
                newChair = Number(USERS_TO_SIT[NEW_USER_SIT].chair)
            }

            rest = 6 - newChair;

            action.payload.users.forEach(player => {

                let T = Number(player.chair) + Number(rest);
                let newChair;
                if (T <= 0) {
                    newChair = T + 9
                } else if (T > 9) {
                    newChair = T - 9
                } else if (0 < T < 9) {
                    newChair = T
                }

                const check = state.players.findIndex(x => x.name === player.name);
                if (check !== -1) {
                    state.players[check] = { num: check + 1, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null }
                }

                if (player.name === state.player.name) {
                    if (state.player.active) {
                        state.player.chair = player.chair;
                        state.player.active = true;
                    } else {
                        state.player.name = player.name;
                        state.player.cash = player.cash;
                        state.player.img = player.img;
                        state.player.buy = player.buy;
                        state.player.numBuy = player.numBuy;
                        state.player.start = player.cash;
                        state.player.chair = player.chair;
                        state.player.active = true;
                    }
                }

                let currentUser = state.players[Number(newChair) - 1];
                currentUser.name = player.name;
                currentUser.cash = player.cash;
                currentUser.img = player.img;
                currentUser.buy = player.buy;
                currentUser.numBuy = player.numBuy;
                currentUser.start = player.cash;
                currentUser.chair = player.chair;
                currentUser.active = true;
            })

            return { ...state };

        case 'PLAY_GAME':
            state.start = true
            return { ...state };

        case 'UPDATE_BIG_SMALL':

            const bisSmall = {
                small: action.payload.small, big: action.payload.big
            }

            return { ...state, bisSmall };

        case 'ASKS_TO_BUY':
            const findPlayer = state.players.filter(x => x.name === action.payload.name);
            if (findPlayer.length > 0) {
                findPlayer[0].toBuy = action.payload.cash
            }
            return { ...state };

        case 'ASKS_TIME':
            const player_time = state.players.filter(p => p.name === action.payload.data.talk)

            player_time[0].time = true;
            if (action.payload.data.talk === state.player.name) {
                state.player.time = true
            }

            return { ...state };

        case 'TIMER':

            return { ...state };

        case 'START_TIMER':
            state.time = true;
            return { ...state };

        case 'STOP_TIMER':
            state.time = false
            return { ...state };

        case 'ADD_MONEY_FOR_PLAYER':
            const playerToAdd = state.players.filter(p => p.name === action.payload.name)
            if (playerToAdd.length > 0) {
                playerToAdd[0].cash += action.payload.cash
                playerToAdd[0].toBuy = 0;
                playerToAdd[0].numBuy++;
                playerToAdd[0].buy = Number(playerToAdd[0].buy) + Number(action.payload.cash)
            }
            if (state.player.name === action.payload.name) {
                state.player.cash += action.payload.cash
                state.player.toBuy = 0;
                state.player.numBuy++;
                state.player.buy = Number(state.player.buy) + Number(action.payload.cash)
            }
            return { ...state };

        case 'REJECT_BUY_FOR_PLAYER':
            const rejectPlayer = state.players.filter(p => p.name === action.payload.name);
            if (rejectPlayer.length > 0) {
                rejectPlayer[0].toBuy = 0;
            }
            if (state.player.name === action.payload.name) {
                state.player.toBuy = 0;
            }
            return { ...state };

        case 'UPDATE_PLAYERS_VISIT':
            action.payload.data.forEach(p => {
                state.players[p.chair - 1].name = p.name;
                state.players[p.chair - 1].chair = p.chair;
                state.players[p.chair - 1].position = p.action;
                state.players[p.chair - 1].hands = p.cards;
                state.players[p.chair - 1].bet = p.bet;
                state.players[p.chair - 1].img = p.img;
                state.players[p.chair - 1].action = p.action;
                state.players[p.chair - 1].active = true;
                state.players[p.chair - 1].cards = p.cards;
                state.players[p.chair - 1].cash = p.cash;
                state.players[p.chair - 1].talk = p.talk;
                state.players[p.chair - 1].buy = p.buy;
                state.players[p.chair - 1].numBuy = p.numBuy;
                state.players[p.chair - 1].time = p.time;
            })
            if (action.payload.board) {
                if (action.payload.board.length > 0) {
                    state.game.board = action.payload.board
                } else {
                    state.game.board = []
                }
            }
            return { ...state };

        case 'UPDATE_WINNER_LAST':

            const playerWinner = state.players.filter(p => p.name === action.payload.name)
            if (playerWinner.length > 0) {
                playerWinner[0].winner = true;
                playerWinner[0].cash += state.game.pot + playerWinner[0].bet
            }
            if (state.player.name === action.payload.name) {
                state.player.winner = true;
                state.player.cash += state.game.pot + state.player.bet
            }
            return { ...state };

        case 'USER_LEFT':
            state.players[action.payload.index].name = '';
            state.players[action.payload.index].cards = [];
            state.players[action.payload.index].cash = 0;
            state.players[action.payload.index].bet = 0;
            state.players[action.payload.index].bet = 0;
            state.players[action.payload.index].buy = 0;
            state.players[action.payload.index].start = 0;
            state.players[action.payload.index].action = '';
            state.players[action.payload.index].toCall = 0;
            state.players[action.payload.index].talk = false;
            state.players[action.payload.index].img = '';
            state.players[action.payload.index].position = '';
            state.players[action.payload.index].winner = false;
            state.players[action.payload.index].flip = false;
            state.players[action.payload.index].active = false;
            state.players[action.payload.index].chair = 0;
            state.players[action.payload.index].sidepot = null;
            state.players[action.payload.index].time = false;


            return { ...state };

        case 'PLAYER_STAND':

            state.players[action.payload].num = 2;
            state.players[action.payload].name = '';
            state.players[action.payload].cards = [];
            state.players[action.payload].cash = 0;
            state.players[action.payload].bet = 0;
            state.players[action.payload].buy = 0;
            state.players[action.payload].start = 0;
            state.players[action.payload].action = '';
            state.players[action.payload].toCall = 0;
            state.players[action.payload].talk = false;
            state.players[action.payload].img = '';
            state.players[action.payload].position = '';
            state.players[action.payload].dealer = false;
            state.players[action.payload].winner = false;
            state.players[action.payload].flip = false;
            state.players[action.payload].active = false;
            state.players[action.payload].chair = 0;
            state.players[action.payload].sidepot = null

            return { ...state };

        case 'UPDATE_PLAYER_DATA':
            const existPlayers = state.players

            existPlayers.forEach(p => {
                const user = action.payload.player.filter(x => x.name === p.name)
                if (user.length > 0) {

                    p.dealer = user[0].dealer;
                    p.position = user[0].position;
                    p.action = user[0].position
                    p.bet = Number(user[0].bet)
                    p.cash -= p.bet
                    if (p.chair === action.payload.chair) {
                        p.cards = action.payload.hand
                        state.player.cards = action.payload.hand
                        state.player.bet = Number(user[0].bet)
                        state.player.cash -= state.player.bet
                    } else {
                        p.cards = [{ suit: null, value: null }, { suit: null, value: null }]
                    }

                }

            });
            state.players = existPlayers;
            state.status = false

            return { ...state };

        case 'UPDATE_DATA':
            const filterUser = state.players.filter(x => x.name === action.payload.lastmove.name)

            if (filterUser[0].name === state.player.name) {
                filterUser[0].bet = action.payload.lastmove.cash;
                filterUser[0].cash -= action.payload.lastmove.cash;
                filterUser[0].action = action.payload.lastmove.move;
                state.cash = action.payload.lastmove.cash;
                state.bet = action.payload.lastmove.bet;
                state.action = action.payload.lastmove.move;
            }

            return { ...state };

        case 'ACTIVE_PLAYER':
            if (action.payload.lastmove.action === 'big' || action.payload.lastmove.action === 'S') {
                const findUser = state.players.findIndex(x => x.name === action.payload.talkname)

                if (findUser !== -1) {
                    state.players[findUser].talk = true
                    state.players[findUser].toCall = action.payload.lastmove.cash - state.players[findUser].bet
                }

                if (state.player.chair === state.players[findUser].chair) {
                    state.player.talk = true
                    state.player.toCall = action.payload.lastmove.cash - state.player.bet
                }

            } else {

                const userTalk = state.players.filter(x => x.name === action.payload.talkname);

                if (userTalk.length > 0) {
                    userTalk[0].toCall = action.payload.lastmove.raise - userTalk[0].bet >= userTalk[0].cash ? userTalk[0].cash : action.payload.lastmove.raise - userTalk[0].bet;
                    userTalk[0].talk = true;
                    if (action.payload.talkname === state.player.name) {
                        state.player.toCall = action.payload.lastmove.raise - userTalk[0].bet >= userTalk[0].cash ? userTalk[0].cash : action.payload.lastmove.raise - userTalk[0].bet
                        state.player.talk = true;
                    }
                }

                const userLastMove = state.players.filter(x => x.name === action.payload.lastmove.name);

                if (userLastMove.length > 0) {

                    if (action.payload.lastmove.move === 'fold') {
                        userLastMove[0].cards = [];
                        state.game.pot += userLastMove[0].bet
                        userLastMove[0].bet = 0
                        userLastMove[0].action = '';
                        userLastMove[0].toCall = 0;
                        userLastMove[0].talk = false;
                        userLastMove[0].time = false;

                    } else {

                        userLastMove[0].talk = false;
                        const sum = action.payload.lastmove.cash;
                        userLastMove[0].cash -= sum - userLastMove[0].bet
                        userLastMove[0].bet += sum - userLastMove[0].bet
                        userLastMove[0].action = action.payload.lastmove.move;
                        userLastMove[0].toCall = 0;
                        userLastMove[0].time = false;

                    }

                }
                if (action.payload.lastmove.name === state.player.name) {
                    if (action.payload.lastmove.move === 'fold') {
                        state.player.cards = []
                        state.player.bet = 0
                        state.player.action = '';
                        state.player.toCall = 0;
                        state.player.talk = false;
                        state.player.time = false;
                    }

                    state.player.talk = false;
                    const sum = action.payload.lastmove.cash;
                    state.player.cash -= sum - state.player.bet
                    state.player.bet += sum - state.player.bet
                    state.player.action = action.payload.lastmove.move;
                    state.player.toCall = 0;
                    state.player.time = false;

                }

            }
            state.lastMove = action.payload.lastmove
            return { ...state };

        case 'UPDATE_MOVE':

            state.game.stage = action.payload.stage;

            return { ...state };

        case 'UPDATE_POT_BOARD_FINISH':
            const POT = action.payload.pot;

            state.game.pot = POT.cash;
            state.game.players = POT.players;
            if (POT.sidePot.length > 0) {
                state.game.sidePots = POT.sidePot

                POT.sidePot.forEach(s => {
                    const PLAYER = state.players.filter(p => p.name === s.players[0])
                    PLAYER[0].sidepot = s.cash;
                    PLAYER[0].allIn = true;
                    PLAYER[0].bet = 0;
                })
            }
            action.payload.players.forEach(p => {
                const player = state.players.filter(x => x.name === p.name)
                if (player.length > 0) {
                    player[0].cash = p.cash;
                    player[0].bet = 0;
                }
                if (p.name === state.player.name) {
                    state.player.cash = p.cash;
                    state.player.bet = 0;

                }

            })

            if (POT.players.length > 1) {
                state.game.board = action.payload.board;
            } else {
                if (POT.sidePot.length > 0) {
                    state.game.board = action.payload.board;
                }
            }


            state.players.forEach(player => {

                player.toCall = 0;
                player.bet = 0;
                player.talk = false;
                player.action = '';
                if (player.name === state.player.name) {
                    state.player.bet = 0;
                    state.player.toCall = 0;
                    state.player.action = '';
                    player.talk = false;

                }
            });

            return { ...state };

        case 'LAST_PLAYER':
            const player = state.players.filter(x => x.name === action.payload.name)
            let cash = 0;
            state.players.forEach(p => {
                cash += p.bet
            })
            if (player.length > 0) {

                player[0].cash += state.game.pot + cash;
                if (player[0].chair === state.player.chair) {
                    state.player.cash += state.game.pot + cash;
                }

            }

            state.game.board = [];
            state.game.pot = 0;
            state.game.stage = null;
            state.game.players = [];
            state.game.sidePots = []
            state.time = false;
            state.player.action = '';
            state.player.winner = false;
            state.player.talk = false;
            state.player.cards = []

            const filterPlayers = state.players;

            filterPlayers.forEach(p => {
                p.action = '';
                p.bet = 0;
                p.cards = [];
                p.dealer = false;
                p.position = '';
                p.talk = false;
                p.toCall = 0;
                p.winner = false;
            })

            return { ...state };

        case 'FINISH_ROUND_END':
            const countPlayer = state.players.filter(p => p.cards.length > 0);
            if (countPlayer.length > 1) {
                action.payload.winner.forEach(w => {
                    w.winner.forEach(WINNER => {

                        if (WINNER) {
                            const win = state.players.filter(p => p.name === WINNER.name);
                            win[0].winner = true;
                            win[0].cash = WINNER.cash

                            if (WINNER.name === state.player.name) {
                                state.player.winner = true;
                                state.player.cash = WINNER.cash
                            }
                        }

                    })
                })
                action.payload.round.players.forEach(p => {
                    const playerFind = state.players.filter(x => x.name === p.name);
                    playerFind[0].cards = p.hand;
                })
                state.players.forEach(p => {
                    if (p.sidepot > 0) {
                    }
                })

            } else {
                countPlayer[0].winner = true
            }

            state.status = true

            return { ...state };

        case 'CLEAR_DATA':

            state.game.board = [];
            state.game.pot = 0;
            state.game.stage = null;
            state.game.players = [];
            state.game.sidePots = [];
            state.time = false;
            state.lastMove = null;
            state.player.action = '';
            state.player.winner = false;
            state.player.talk = false;
            state.player.cards = [];
            state.player.bet = 0;
            state.player.toCall = 0;
            state.player.dealer = false;
            state.player.position = '';
            state.player.allIn = false;
            state.player.sidepot = null;
            state.player.toCall = 0;
            state.player.toBuy = 0;

            const filterPlayersFinish = state.players;
            filterPlayersFinish.forEach((p, i) => {
                p.action = '';
                p.winner = false;
                p.talk = false;
                p.cards = [];
                p.bet = 0;
                p.toCall = 0;
                p.dealer = false;
                p.position = '';
                p.allIn = false;
                p.sidepot = null;
                p.toCall = 0;
                p.toBuy = 0;
            })

            return { ...state };;

        case 'EXIT_ROOM':
            return {
                admin: null,
                player: { num: 2, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false },
                players: [{ num: 1, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false },
                { num: 2, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false },
                { num: 3, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false },
                { num: 4, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false },
                { num: 5, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false },
                { num: 6, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false },
                { num: 7, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false },
                { num: 8, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false },
                { num: 9, name: '', cards: [], cash: 0, bet: 0, buy: 0, start: 0, toCall: 0, action: '', talk: false, img: '', position: '', dealer: false, winner: false, flip: false, active: false, chair: 0, sidepot: null, allIn: false, toBuy: 0, time: false }],
                id: null,
                bigSmall: { small: 0, big: 0 },
                bets: false,
                status: false,
                game: { stage: null, pot: 0, board: [], players: [], sidePots: [] },
                asks_buy: [],
                lastMove: null,
                time: false,
                start: false

            };

        default:
            return state;
    }
}

export default roomReducer;