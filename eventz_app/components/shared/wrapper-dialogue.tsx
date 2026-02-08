import { view } from "@/styles/view";
import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogContent,
} from '@/components/ui/alert-dialog';
import { ViewStyle } from "@expo/html-elements/build/primitives/View";
import { ReactNode } from "react";


export interface iWrapperDialogProps {
    onClose: () => void,
    isOpen: boolean,
    backDropClassName?: string,
    dialogContentClassName?: string,
    backDropStyle?: ViewStyle | ViewStyle[],
    dialogContentStyle?: ViewStyle | ViewStyle[],
    children: ReactNode,
    closeOnOverlayClick?: boolean
}


const WrapperDialog = ({ isOpen, onClose, backDropClassName, backDropStyle, dialogContentClassName, dialogContentStyle, children, closeOnOverlayClick = true }: iWrapperDialogProps) => {
    return (
        <AlertDialog isOpen={isOpen} onClose={onClose} closeOnOverlayClick={closeOnOverlayClick}>
            <AlertDialogBackdrop className={backDropClassName} style={backDropStyle} />
            <AlertDialogContent className={`bg-transparent border-none p-[0px] ${dialogContentClassName}`}
                style={typeof dialogContentStyle === 'object' ? [view.borderWidth(0), dialogContentStyle as ViewStyle] : [view.borderWidth(0)].concat(dialogContentStyle as unknown as ViewStyle[])}>
                {children}
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default WrapperDialog;