import * as Burnt from "burnt";
import { ToastOptions } from "burnt/build/types";

const toast = (options: ToastOptions) => Burnt.toast(options);

const alert = (options: ToastOptions) => Burnt.alert(options);

const dismissAllAlerts = (options: ToastOptions) => Burnt.dismissAllAlerts();

export const burnt = {
    toast,
    alert,
    dismissAllAlerts,
}