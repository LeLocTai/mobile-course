document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    navigator.notification.confirm(
        "Choose action",
        onDialogConfirmed,
        "Dialog",
        ["Beep", "Vibrate"]
    );

    function onDialogConfirmed(index) {
        switch (index) {
            case 0:
                navigator.notification.beep(3);
                break;
            case 1:
                navigator.vibrate(1000);
                break;
        }
    }
}
