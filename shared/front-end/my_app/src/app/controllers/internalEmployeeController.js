module.exports = ['$scope', '$http', 'authService', '$mdToast', '$httpParamSerializerJQLike', '$state', function ($scope, $http, authService, $mdToast, $httpParamSerializerJQLike, $state) {
    function toast(msg) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(msg)
                .position('bottom right')
                .hideDelay(3000)
        );
    }



    function randomString() {
        return Math.floor(Math.random()*90000) + 10000 + "";
    }

    function getUsers() {
        return $http.get(BACKEND_URL + '/api/users/', {
            headers: {
                "authorization": authService.getAuth()
            }
        });
    }

    function setRandomCreateData() {
        $scope.create = {
            "username": randomString(),
            "email": randomString()+"@abc.com",
            "password": "password",
            "firstName": randomString(),
            "lastName": randomString(),
            "is_staff": false,
            "uType": "tier1",
            "isMerchant": false,
        };
    }

    $scope.filterInternal=function(transaction)
    {
        if(transaction.status=='pending')
        {
            if(transaction.critical==false)
            {
                return true;
            }
        }
        return false;
    };

    $scope.filterManager=function(transaction)
    {
        if(transaction.status=='pending')
        {
                return true;
        }
        return false;
    };

    $scope.approveTransaction = function(TransactionId)
    {

        return $http.put(BACKEND_URL + '/api/transactions/'+TransactionId,{
            "status":"approved"

        },{
            headers:{
                "authorization": authService.getAuth()
            }
        });
    }

    $scope.declineTransaction = function(TransactionId)
    {

        return $http.put(BACKEND_URL + '/api/transactions/'+TransactionId,{
            "status":"denied"

        },{
            headers:{
                "authorization": authService.getAuth()
            }
        });
    }



    $scope.createUser = function(username,email,password,phNumber,name,address,type){
        return $http.post(BACKEND_URL+'/api/users/',{
            "type": type,
            "name": name,
            "address": address,
            "phoneNumber": phNumber,
            "username": username,
            "password": password
        },{
            headers:{
                "authorization": authService.getAuth()
            }
        });
    }

    function fetchUsers() {
        getUsers().then(function successCallback(response) {
            $scope.users = response.data;
        }, function errorCallback(response) {
            toast('Error loading users');
        });
    }

    $scope.postTransaction = function(fromId,toId){
        return $http.post(BACKEND_URL+'/api/transactions/',{
            "fromAccountId": fromId,
            "toAccountId": toId,
            "type": "debit",
            "amount": $scope.Amount

        },{
            headers:{
                "authorization": authService.getAuth()
            }
        });
    }

    $scope.createTransaction=function(fromId,toId){
        if(fromId!=toId)
        {
            $scope.postTransaction(fromId,toId);
        }

        else {toast('Sender and Receiver Account Id cannot be the same');}
    }

    function getAllTransactions(){
        return $http.get(BACKEND_URL + '/api/transactions/', {
            headers: {
                "authorization": authService.getAuth()
            }

        });
    }

    function fetchTransactions(){
        getAllTransactions().then(function successCallback(response) {
            $scope.transactions = response.data;
        }, function errorCallback(response) {
            toast('Error loading transactions');
        });
    }



    $scope.submit = function () {
        console.log($scope.create);
        createUser().then(function successCallback(response) {
            console.log(response.data);
            toast('Successfully created User');
            fetchUsers();
            delete $scope.create; //clear inputted data
        }, function errorCallback(response) {
            toast('Error loading users');
        });
    };

    $scope.setRandomData = function () {
        setRandomCreateData();
    };

    $scope.editUser = function (user) {
        console.log('editUser',user);
        $state.transitionTo('dashboard_admin_edit_user',{user:user});
    };

    $scope.userData = function (user) {
        console.log('userData',user);
        $state.transitionTo('dashboard_admin',{user:user});
    };

    $scope.deleteUser = function (user) {
        console.log('delete user: ', user);
        $http.delete(user.url,{
            headers: {
                "authorization": authService.getAuth(),
            }
        }).then(function success(){
            fetchUsers();
        }, function errorCallback(){
            toast('Failed to delete User');
        })
    };

    fetchUsers();
    fetchTransactions();

}];

