export type ToastState = {
	visible: boolean
}

const Toast = (toastState: ToastState) => {
	return <>
		<div id="toast">
			{toastState.visible && 
				<>
					
				</>
			}
		</div>
	</>
}

export default Toast 