export type ToastState = {
	visible: boolean
}

const Toast = ({ toastState }) => {
	return (
		<>
			{ toastState.visible && 
				<div id="toast">
					Hi
				</div>
			}
		</>
	)
}

export default Toast 