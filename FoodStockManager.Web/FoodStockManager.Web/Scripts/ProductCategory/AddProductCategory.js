﻿$(document).ready(function () {

    var currentUrl = window.location.href;
    var user = JSON.parse(window.sessionStorage.getItem("loggedInUser"));
    var userFunctions = user.Function;

    var authorized = false;
    $.each(userFunctions, function (key, userfunction) {
        var link = settingsManager.websiteURL.trimRight('/') + userfunction.PageLink;
        if (currentUrl == link) {
            authorized = true;
        }
    });

    if (!authorized)
        window.location.href = '../System/UnAuthorized';
});

String.prototype.trimRight = function (charlist) {
    if (charlist === undefined)
        charlist = "\s";

    return this.replace(new RegExp("[" + charlist + "]+$"), "");
};

function addProductCategory() {
    try {

        var formValid = $('#demo-form').parsley().validate();
        if (formValid) {
            $('#addBtn').html('<i class="fa fa-spinner fa-spin"></i>');
            $("#addBtn").attr("disabled", "disabled");

            var productCategoryName = $('#productCategoryName').val().toUpperCase();

            var user = JSON.parse(window.sessionStorage.getItem("loggedInUser"));
            var createdby = user.ID;

            var data = { Name: productCategoryName, CreatedBy: createdby };
            $.ajax({
                url: settingsManager.websiteURL + 'api/ProductCategoryAPI/SaveProductCategory',
                type: 'POST',
                data: data,
                processData: true,
                async: true,
                cache: false,
                success: function (response) {
                    displayMessage("success", response, "Product Category Management");
                    $('#productCategoryName').val('');
                    $("#addBtn").removeAttr("disabled");
                    $('#addBtn').html('Add');
                },
                error: function (xhr) {
                    displayMessage("error", 'Error experienced: ' + xhr.responseText, "Product Category  Management");
                    $("#addBtn").removeAttr("disabled");
                    $('#addBtn').html('Add');
                }
            });
        } else {
            displayMessage("warning", "Fill the required values", "Product Category  Management");
        }
    } catch (err) {
        displayMessage("error", "Error encountered: " + err, "Product Category  Management");
        $("#addBtn").removeAttr("disabled");
        $('#addBtn').html('Add');
    }
}