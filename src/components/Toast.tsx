import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

export type ToastState = {
	visible: boolean;
	type: 'error' | 'success' | 'none';
	message: string;
}

const Toast = ({ toastState }) => {
	const toastClass = [
		'toast',
		!toastState.visible && 'toast-hidden',
		toastState.type !== 'none' && `toast-${toastState.type}`,
	].filter(Boolean).join(' ')

	return (
		<>
			<div id="toast" className={toastClass}>
				{toastState.type === 'success' && <span><FaCheck />{toastState.message}</span>}
				{toastState.type === 'error' && <span><FaX />{toastState.message}</span>}
			</div>
		</>
	)
}

export default Toast 