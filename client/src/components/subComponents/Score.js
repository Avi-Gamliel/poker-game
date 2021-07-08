import { useSelector } from 'react-redux'
import { IoMdArrowRoundDown, IoMdArrowRoundUp } from "react-icons/io";
export const Score = (props) => {
    const ROOM = useSelector(state => state.ROOM)
    return (
        <table className="table-main">
            <thead>
                <tr className="table-title">
                    <th>NAME</th>
                    <th>BUY</th>
                    <th>START</th>
                    <th></th>
                    <th>CURRENT</th>
                </tr>
            </thead>
            <tbody>
                {ROOM && ROOM.players.filter(p => p.active).map((player, i) =>
                    <tr key={i} className={`player-score chair-${player.num}`}>
                        <td className='name-td'>{player.name}</td>
                        <td className="start-score">{player.numBuy}</td>
                        <td className="numBuy-score">{player.buy}</td>
                        <td className="start-score">
                            {player.buy < player.cash ?
                                <IoMdArrowRoundUp color='green' />
                                :
                                <IoMdArrowRoundDown color='red' />
                            }
                        </td>
                        <td className="current-score" >{player.cash}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}