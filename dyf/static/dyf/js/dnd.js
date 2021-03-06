/**
 * Created by raymund on 2016.03.31..
 */

(function() {


    function fruitOut() {
        console.log(fruitNames);
    }

    /*YamlHandler*/

    //file drag hover style
    function FileDragHover(e) {
        e.stopPropagation();
        e.preventDefault();
        e.target.className = (e.type == "dragover" ? "hover" : "");
    }

    //file selection
    function FileSelectHandler(e) {

        //cancel event and hover styling
        FileDragHover(e);

        //fetch FileList object
        var files = e.target.files || e.dataTransfer.files;

        //process all File objects
        for (var i = 0, f; f = files[i]; i++) {
            ParseFile(f);
        }

    }

    function ParseFile(file) {

        var reader = new FileReader();

        //display yaml
            reader.onload = function(e) {
                var yml,
                    fruits;
                yml = e.target.result;
                fruits = YAML.parse(yml);



                ymlHandler(fruits);
            }
            reader.readAsText(file);
            console.log("Yaml file opened: " + file.name);
        //}

    }

    // initialize
    function Init() {

        var fileDrag = $id("fileDrag");

        //is XHR2 available?
        var xhr = new XMLHttpRequest();
        if (xhr.upload) {

            //file drop
            fileDrag.addEventListener("dragover", FileDragHover, false);
            fileDrag.addEventListener("dragleave", FileDragHover, false);
            fileDrag.addEventListener("drop", FileSelectHandler, false);
            fileDrag.style.display = "block";

        }

    }

    // call initialization file
	if (window.File && window.FileList && window.FileReader) {
		Init();
	}

})();