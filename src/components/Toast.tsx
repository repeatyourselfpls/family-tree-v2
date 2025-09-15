export type ToastState = {
	visible: boolean;
	type: 'error' | 'success' | 'none';
	message: string;
}

const Toast = ({ toastState }) => {
	const toastClass = [
		'toast',
		!toastState.visible && 'toast-hidden',
		toastState.type !== 'none' && `toast-${toastState.type}`
	].filter(Boolean).join(' ')
	console.log(toastClass);

	return (
		<>
			<div id="toast" className={toastClass}>
				{toastState.message}
			</div>
		</>
	)
}

export default Toast 