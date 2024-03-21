export function onRouteDidUpdate({location, previousLocation}) {
    window.gtranslateSettings = {"default_language":"en","native_language_names":true,"languages":["en","fr","de","hi","it","ja","ko"],"wrapper_selector":".gtranslate_wrapper","flag_size":24,"switcher_horizontal_position":"inline"}
    let element = document.getElementById('gtranslateBlock');
    if(element && !element.dataset.loaded) {
        let script = document.createElement('script');
        script.src = "https://cdn.gtranslate.net/widgets/latest/dwf.js";
        script.defer = true;
        document.head.appendChild(script);
        element.dataset.loaded = true;
    }
}