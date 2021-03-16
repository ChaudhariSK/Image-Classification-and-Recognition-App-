$(function () {

    var url = "https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/1856fbd6-53b6-4586-a282-1606a47c6688/classify/iterations/Iteration2/image";
    var predictionKey = "5f557815ad234e10aeae030d1b5e3c3b";
    
    var fs = require("fs");
    var _ = require('underscore');

    // Store the value of a selected image for display
    var imageBytes;

    // Handle clicks of the Browse (...) button
    $("#select_button").click(function () {

        $('#analysisResults').html('');
        $('#analyze_button').prop('disabled', true);

        const electron = require('electron');
        const dialog = require('electron').dialog;

        var va = electron.remote.dialog.showOpenDialog();

        var contents = fs.readFileSync(va[0], "base64");
        imageBytes = fs.readFileSync(va[0]);

        $('#previewImage').html('<img width="500" src="data:image/png;base64,' + contents + '" />');
        $('#analyze_button').prop('disabled', false);

    });

    // Handle clicks of the Analyze button
    $("#analyze_button").click(function () {

        $.ajax({
            type: "POST",
            url: url,
            data: imageBytes,
            processData: false,
            headers: {
                "Prediction-Key": predictionKey,
                "Content-Type": "multipart/form-data"
            }
        }).done(function (data) {
            var predictions = data.predictions;
            var artists = [predictions.find(o => o.tagName === 'Picasso'), predictions.find(o => o.tagName === 'Rembrandt'), predictions.find(o => o.tagName === 'Pollock'), predictions.find(o => o.tagName === 'tiger'), predictions.find(o => o.tagName === 'laptop'), predictions.find(o => o.tagName === 'dog'), predictions.find(o => o.tagName === 'car')];
            var sortedArtists = _.sortBy(artists, 'probability').reverse();
            var possibleArtist = sortedArtists[0];
        
            if (possibleArtist.probability > 0.9) {
                $('#analysisResults').html('<div class="matchLabel">' + possibleArtist.tagName + ' (' + (possibleArtist.probability * 100).toFixed(0) + '%)' + '</div>');
            }
            else {
                $('#analysisResults').html('<div class="noMatchLabel">Unknown artist</div>');
            }
        
        }).fail(function (xhr, status, err) {
            alert(err);
        });

        $('#analyze_button').prop('disabled', true);
    });

});




