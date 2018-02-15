'use strict';

/**
* @ngdoc home
* @name dashyAngular
* @description
* # dashyAngular
*
* Main module of the application.
*/
window.app_version = 6;

angular
.module('collectionApp', [
    'ui.router',
    'authServices',
    'userServices'
    ])
.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    
    $httpProvider.interceptors.push('AuthInterceptors');

    $urlRouterProvider.when('/productlist', '/product/productlist')
    $urlRouterProvider.when('/dashboard', '/dashboard/home')
    $urlRouterProvider.otherwise('/productlist');

    $stateProvider
    .state('plain', {
        abstract: true,
        url: '',
        templateUrl: 'views/layouts/plain.html?v='+window.app_version,
        authenticated: false
    })
    .state('product',{
        abstract: true,
        url: '/product',
        parent: 'plain',
        templateUrl: 'views/layouts/home.html?v='+window.app_version,
        authenticated: false
    })
    .state('productlist', {
        url: '/productlist',
        parent: 'product',
        templateUrl: 'views/pages/productList.html?v='+window.app_version,
        controller: 'productCtrl',
        authenticated: false 
    })
    .state('/productlist/:user_name', {
        url: '/productlist/:user_name',
        parent: 'product',
        templateUrl: 'views/pages/productList.html?v='+window.app_version,
        controller: 'productCtrl',
        authenticated: false 
    })
    .state('/productdetail/:id', {
        url: '/productdetail/:id',
        parent: 'product',
        templateUrl: 'views/pages/productDetail.html?v='+window.app_version,
        controller: 'productDetailCtrl',
        authenticated: false
    })
    .state('boxed', {
        abstract: true,
        url: '/boxed',
        parent: 'plain',
        templateUrl: 'views/layouts/boxed.html?v='+window.app_version,
        authenticated: false
    })
    .state('login', {
        url: '/login',
        parent: 'boxed',
        templateUrl: 'views/pages/login.html?v='+window.app_version,
        controller: 'MainCtrl',
        authenticated: false
    })
    .state('signup', {
        url: '/signup',
        templateUrl: 'views/pages/signup.html?v='+window.app_version,
        parent: 'boxed',
        controller: 'signupCtrl',
        authenticated: false
    })
    .state('/signup/:user_name', {
        url: '/signup/:user_name',
        templateUrl: 'views/pages/signup.html?v='+window.app_version,
        parent: 'boxed',
        controller: 'signupCtrl',
        authenticated: false
    })
    .state('forgot-password', {
        url: '/forgot-password',
        parent: 'boxed',
        templateUrl: 'views/pages/forgot-password.html?v='+window.app_version,
        controller: 'forgateCtrl',
        authenticated: false
    })
    .state('/reset/:token', {
        url: '/reset/:token',
        templateUrl: 'views/pages/resetPassword.html?v='+window.app_version,
        parent: 'boxed',
        controller: 'signupCtrl',
        authenticated: false
    })
    .state('dashboard', {
        url: '/dashboard',
        parent: 'plain',
        templateUrl: 'views/layouts/dashboard.html?v='+window.app_version,
        authenticated: true
    })
    .state('home', {
        url: '/home',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/home.html?v='+window.app_version,
        controller: 'collectionCtrl',
        authenticated: true
    })
    .state('collection', {
        url: '/collection/info',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/collection/collection.html?v='+window.app_version,
        controller: 'collectionCtrl',
        authenticated: true
    })
    .state('collectionCreate', {
        url: '/collection/create',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/collection/collectionCreate.html?v='+window.app_version,
        controller: 'collectionCreateCtrl',
        authenticated: true
    })
    .state('collection/Info/:id', {
        url: '/collection/info/:id',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/collection/collectionInfo.html?v='+window.app_version,
        controller: 'UDRCollectionCtrl',
        authenticated: true
    })
    .state('/collection/info/:id/edit', {
        url: '/collection/info/:id/edit',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/collection/collectionEdit.html?v='+window.app_version,
        controller: 'UDRCollectionCtrl',
        authenticated: true
    })
    .state('collection/items/:id', {
        url: '/collection/items/:id',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/collection/collectionItem.html?v='+window.app_version,
        controller: 'UDRCollectionCtrl',
        authenticated: true
    })
    .state('collection/items/:id/createItem', {
        url: '/collection/items/:id/createItem',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/item/itemCreate.html?v='+window.app_version,
        controller: 'itemCreateCtrl',
        authenticated: true
    })
    .state('item', {
        url: '/item',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/item/item.html?v='+window.app_version,
        controller: 'itemCtrl',
        authenticated: true
    })
    .state('itemCreate', {
        url: '/item/create',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/item/itemCreate.html?v='+window.app_version,
        controller: 'itemCreateCtrl',
        authenticated: true
    })
    .state('item/Info/:id', {
        url: '/item/info/:id',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/item/itemInfo.html?v='+window.app_version,
        controller: 'UDRItemCtrl',
        authenticated: true
    })
    .state('/item/info/:id/edit', {
        url: '/item/info/:id/edit',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/item/itemEdit.html?v='+window.app_version,
        controller: 'UDRItemCtrl',
        authenticated: true
    })
    .state('profile', {
        url: '/profile',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/profile/profile.html?v='+window.app_version,
        controller: 'profileCtrl',
        authenticated: true
    })
    .state('/profile/:id/edit', {
        url: '/profile/:id/edit',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/profile/profileEdit.html?v='+window.app_version,
        controller: 'UDRProfileCtrl',
        authenticated: true
    })
    .state('test', {
        url: '/test',
        parent: 'dashboard',
        templateUrl: 'views/pages/dashboard/test/test.html?v='+window.app_version,
        controller: 'testCtrl',
        authenticated: true
    })
    $locationProvider.html5Mode({
       enabled: true,
       requireBase: false
    });
})
.run(['$rootScope', 'Auth', '$state', 'User', function($rootScope, Auth, $state, User) {
    $rootScope.$on('$stateChangeStart', function(event, next, current) {
        //console.log(next.authenticated);
        if(next.authenticated == true){
            //console.log('Need to be authenticated');
            if(!Auth.isLoggedIn()){
                event.preventDefault();
                $state.go('login');  
            }else if(next.permission){
                User.getPermission().then(function(response){
                   //console.log(response);
                    if(next.permission[0] !== response.data.data.permission){
                        if(next.permission[1] !== response.data.data.permission){
                            if(next.permission[2] !== response.data.data.permission){
                                event.preventDefault();
                                $state.go('home'); 
                            }
                        }
                    } 
                });

            }
        }else if(next.authenticated == false){
            //console.log('should not needs to be authenticated')
            if(Auth.isLoggedIn()){
                event.preventDefault();
                $state.go('home');
            }
        }
    });
}])
