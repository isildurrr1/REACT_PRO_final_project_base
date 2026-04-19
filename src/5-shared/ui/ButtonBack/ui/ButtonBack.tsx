import { useNavigate } from 'react-router-dom';
import { ReactComponent as BackSvg } from './../../../assets/icons/back.svg';
import s from './ButtonBack.module.css';

export const ButtonBack = () => {
	const navigate = useNavigate();
	return (
		<button className={s.btn} onClick={() => navigate(-1)}>
			<BackSvg className={s.icon} />
			Назад
		</button>
	);
};
