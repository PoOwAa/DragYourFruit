/**
 * Created by raymund on 2016.03.31..
 */

(function() {
    /*
    function createNDimArray(dimensions) {
        if (dimensions.length > 0) {
            var dim = dimensions[0];
            var rest = dimensions.slice(1);
            var newArray = new Array();
            for (var i = 0; i < dim; i++) {
                newArray[i] = createNDimArray(rest);
            }
            return newArray;
        } else {
            return undefined;
        }
    }

    function getElement(array, indices) {
        if (indices.length == 0) {
            return array;
        } else {
            return getElement(array[indices[0]], indices.slice(1));
        }
    }
    */

    //var fruitNames = createNDimArray(3);

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

    /*
		Output(
			"<p>File information: <strong>" + file.name +
			"</strong> type: <strong>" + file.type +
			"</strong> size: <strong>" + file.size +
			"</strong> bytes</p>"
		);
    */
        var reader = new FileReader();

        //display yaml

        //if (file.type.indexOf("application") == 0) {
            reader.onload = function(e) {
                var yml,
                    //json,
                    fruits;
                yml = e.target.result;
                fruits = YAML.parse(yml);
                /*
                json = JSON.stringify(data);
                console.log(json);
                console.log(yml);
                console.log(data);
                */


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