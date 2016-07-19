var products;

$(document).ready(function () {
    try {
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
        else {
            $('#rootwizard').bootstrapWizard({ 'tabClass': 'bwizard-steps' });
            getProduct();
            initializeSelectedOrder();
            initializeCheckout();
            products = [];
        }
    } catch (err) {
        displayMessage("error", "Error encountered: " + err, "Order Management");
    }
});

String.prototype.trimRight = function (charlist) {
    if (charlist === undefined)
        charlist = "\s";

    return this.replace(new RegExp("[" + charlist + "]+$"), "");
};

function getProduct() {

    $('#product tfoot th').each(function () {
        var title = $('#product thead th').eq($(this).index()).text();
        if (title != "")
            $(this).html('<input type="text" placeholder="Search ' + title + '" />');
    });

    var table = $('#product').DataTable({

        "processing": true,

        "ajax": settingsManager.websiteURL + 'api/ProductAPI/RetrieveProduct',

        "columns": [
            { "data": "ProductCategoryName" },
            { "data": "Name" },
            { "data": "Level" },
            {
                "className": 'addtocart-control',
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },
            {
                "data": "ID",
                "visible": false
            },
        ],

        "order": [[0, "asc"]],
    });

    $('#product tbody').on('click', 'td.addtocart-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        var product = row.data();
        addProductToBasket(product);
    });

    $("#product tfoot input").on('keyup change', function () {
        table
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });
}

var dt;
function initializeSelectedOrder() {
    var dataSet = [];
    
    $('#selectedorder tfoot th').each(function () {
        var title = $('#selectedorder thead th').eq($(this).index()).text();
        if (title != "")
            $(this).html('<input type="text" placeholder="Search ' + title + '" />');
    });

    dt = $('#selectedorder').DataTable({

        "processing": true,

        data: dataSet,

        "columns": [
            { "title": "Category" },
            { "title": "Name" },
            { "title": "Available Quantity" },
            { "title": "Requested Quantity" },
            {
                "className": 'edit-control',
                "orderable": false,
                "title": '',
                "defaultContent": ''
            },
            {
                "className": 'delete-control',
                "orderable": false,
                "title": '',
                "defaultContent": ''
            },
            {
                "title": "ID",
                "visible": false
            }
        ],

        "order": [[0, "asc"]],
    });

    $('#selectedorder tbody').on('click', 'td.edit-control', function () {
        var tr = $(this).closest('tr');
        var row = dt.row(tr);
        var data = row.data();

        var availableQty = data[2];
        var requiredQty = data[3];
        var id = data[6];

        var userRequiredQty = prompt("Please enter your required quantity. Available quantity is: " + availableQty, requiredQty);
        if (userRequiredQty != null) {
            if (!isNaN(userRequiredQty)) {
                if (availableQty >= userRequiredQty) {
                    var productexist = false;
                    //loop through the product datasource
                    for (var i = 0, l = products.length; i < l; i++) {
                        var existingProductID = products[i][6];
                        //check if the product to be added exist.
                        if (existingProductID === id) {
                            //if the product exist, increment the required quantity and check that it is not more than the product available quantity.
                            products[i][3] = parseInt(userRequiredQty);
                            //clear the current table
                            var table = $('#selectedorder').DataTable();
                            table.clear().draw();
                            //loop through the product datasource and update the product table
                            for (var i = 0, l = products.length; i < l; i++) {
                                dt.row.add([products[i][0], products[i][1], products[i][2], products[i][3], '', '', products[i][6]]).draw();
                            }
                            checkoutOrder();
                            displayMessage("success", "Order required quantity updated successfully", "Order Management");
                            break;
                        }
                    }
                }
            }
        }
    });

    $('#selectedorder tbody').on('click', 'td.delete-control', function () {
        var tr = $(this).closest('tr');
        var row = dt.row(tr);
        var data = row.data();
        
        var deleteorder = confirm("Are you sure you want to delete order: " + data[1] + "?");
        if (deleteorder) {
            var id = data[6];
            for (var i = 0, l = products.length; i < l; i++) {
                var existingProductID = products[i][6];
                //check if the product to be added exist.
                if (existingProductID === id) {
                    products.splice(i, 1);

                    var table = $('#selectedorder').DataTable();
                    table.clear().draw();
                    //loop through the product datasource and update the product table
                    for (var i = 0, l = products.length; i < l; i++) {
                        dt.row.add([products[i][0], products[i][1], products[i][2], products[i][3], '', '', products[i][6]]).draw();
                    }
                    checkoutOrder();
                    displayMessage("success", "Order deleted successfully", "Order Management");
                    break;
                }
            }
        } else {
            return;
        }
    });

    $("#selectedorder tfoot input").on('keyup change', function () {
        table
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });
}

function addProductToBasket(product) {
    try{
        $("#shoppingBasket").removeClass('defaultBasket');
        $("#shoppingBasket").addClass('activeBasket');

        //check if the product datasource is empty
        if (products.length == 0) {
            //if empty, push product to the datasource.
            products.push([product.ProductCategoryName, product.Name, product.Level, 1, '', '', product.ID]);
            //add the product to the datatable
            dt.row.add([product.ProductCategoryName, product.Name, product.Level, 1, '', '', product.ID]).draw();
        } else {
            var productexist = false;
            //loop through the product datasource
            for (var i = 0, l = products.length; i < l; i++) {
                var existingProductID = products[i][6];
                //check if the product to be added exist.
                if (existingProductID === product.ID) {
                    //if the product exist, increment the required quantity and check that it is not more than the product available quantity.
                    var existingProductRequiredLevel = products[i][3];
                    existingProductRequiredLevel = products[i][3] + 1;

                    var existingProductAvailableLevel = products[i][2];

                    if (existingProductAvailableLevel >= existingProductRequiredLevel) {
                        products[i][3] = (products[i][3] + 1);
                    }
                    productexist = true;
                    break;
                }
            }
            if (productexist) {
                //clear the current table
                var table = $('#selectedorder').DataTable();
                table.clear().draw();
                //loop through the product datasource and update the product table
                for (var i = 0, l = products.length; i < l; i++) {
                    dt.row.add([products[i][0], products[i][1], products[i][2], products[i][3], '', '', products[i][6]]).draw();
                }
            } else {
                products.push([product.ProductCategoryName, product.Name, product.Level, 1, '', '', product.ID]);
                //add the product to the datatable
                dt.row.add([product.ProductCategoryName, product.Name, product.Level, 1, '', '', product.ID]).draw();
            }
        }
        window.setTimeout(restoreBasketIcon, 400);
        checkoutOrder();
    } catch (e) {
        displayMessage("error", "Error encountered: " + e, "Order Management");
    }
}

var datatable;
function initializeCheckout() {
    var dataSet = [];

    $('#order tfoot th').each(function () {
        var title = $('#order thead th').eq($(this).index()).text();
        if (title != "")
            $(this).html('<input type="text" placeholder="Search ' + title + '" />');
    });

    datatable = $('#order').DataTable({

        "processing": true,

        data: dataSet,

        "columns": [
            { "title": "Name" },
            { "title": "Requested Quantity" },
            {
                "title": "ID",
                "visible": false
            }
        ],

        "order": [[0, "asc"]],
    });

    $("#order tfoot input").on('keyup change', function () {
        table
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });
}

function checkoutOrder() {
    try {
        //clear the current table
        var table = $('#order').DataTable();
        table.clear().draw();
        //loop through the product datasource and update the product table
        for (var i = 0, l = products.length; i < l; i++) {
            datatable.row.add([products[i][1], products[i][3], products[i][6]]).draw();
        }
    } catch (e) {
        displayMessage("error", "Error encountered: " + e, "Order Management");
    }
}

function confirmOrder() {
    try{
        if (products.length == 0) {
            displayMessage("warning", "No orders to confirm", "Order Management");
        } else {
            $('#addBtn').html('<i class="fa fa-spinner fa-spin"></i>');
            $("#addBtn").attr("disabled", "disabled");

            var orderItems = [];
            var totalQty = 0;
            for (var i = 0, l = products.length; i < l; i++) {
                var productID = products[i][6];
                var productQty = products[i][3];
                
                var orderItem = { ProductId: productID, QuantityRequested: productQty };
                orderItems.push(orderItem);

                totalQty = totalQty + productQty;
            }

            var user = JSON.parse(window.sessionStorage.getItem("loggedInUser"));
            var orderBranch = user.Branch.ID;
            var orderedBy = user.ID;

            var data = { TotalQuantityRequested: totalQty, OrderBranch: orderBranch, OrderedBy: orderedBy, OrderItems: orderItems };
            $.ajax({
                url: settingsManager.websiteURL + 'api/OrderAPI/SaveOrder',
                type: 'POST',
                data: data,
                processData: true,
                async: true,
                cache: false,
                success: function (response) {
                    displayMessage("success", response, "Functions Management");

                    products = [];
                    var selectedorderdt = $('#selectedorder').DataTable();
                    selectedorderdt.clear().draw();

                    var orderdt = $('#order').DataTable();
                    orderdt.clear().draw();

                    $("#addBtn").removeAttr("disabled");
                    $('#addBtn').html('Confirm Order');
                },
                error: function (xhr) {
                    displayMessage("error", 'Error experienced: ' + xhr.responseText, "Functions Management");
                    $("#addBtn").removeAttr("disabled");
                    $('#addBtn').html('Confirm Order');
                }
            });
        }
    } catch (e) {
        displayMessage("error", "Error encountered: " + e, "Order Management");
        $("#addBtn").removeAttr("disabled");
        $('#addBtn').html('Check out your order');
    }
}

function restoreBasketIcon() {
    $("#shoppingBasket").removeClass('activeBasket');
    $("#shoppingBasket").addClass('defaultBasket');
}

function refreshResult() {
    try {
        var table = $('#product').DataTable();
        table.ajax.reload();
    } catch (err) {
        displayMessage("error", "Error encountered: " + err, "Order Management");
    }
}

$(document).ready(function () {
    $('#dataTables-product').DataTable({
        responsive: true
    });

    $('#dataTables-selectedorder').DataTable({
        responsive: true
    });
});