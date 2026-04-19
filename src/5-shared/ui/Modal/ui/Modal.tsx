import { ReactNode, RefObject, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import s from './Modal.module.css';

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	triggerRef?: RefObject<HTMLElement | null>;
	children: ReactNode;
};

export const Modal = ({ isOpen, onClose, triggerRef, children }: ModalProps) => {
	const closeButtonRef = useRef<HTMLButtonElement>(null);

	// Закрытие по ESC
	useEffect(() => {
		if (!isOpen) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		document.addEventListener('keydown', handler);
		return () => document.removeEventListener('keydown', handler);
	}, [isOpen, onClose]);

	// Управление фокусом: при открытии — на кнопку закрытия, при закрытии — на триггер
	useEffect(() => {
		if (isOpen) {
			closeButtonRef.current?.focus();
		} else {
			(triggerRef?.current as HTMLElement | null)?.focus();
		}
	}, [isOpen, triggerRef]);

	if (!isOpen) return null;

	return createPortal(
		<div
			className={s['overlay']}
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}>
			<div className={s['modal']} role='dialog' aria-modal='true'>
				<button ref={closeButtonRef} className={s['close']} onClick={onClose}>
					×
				</button>
				{children}
			</div>
		</div>,
		document.getElementById('modal-root')!
	);
};
