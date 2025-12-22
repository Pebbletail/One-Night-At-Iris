function init_default() {
    sessionStorage.setItem("irisAI", "8");
    sessionStorage.setItem("taylorAI", "10");
    sessionStorage.setItem("leoAI", "10");
    sessionStorage.setItem("picklesAI", "10");
    sessionStorage.setItem("hazelAI", "13");
    sessionStorage.setItem("rubyAI", "10");
    sessionStorage.setItem("nigelAI", "10");

    sessionStorage.setItem("longNights", "0");
}

function activate_debug() {
    sessionStorage.setItem("debugActive", "true");
}

init_default();