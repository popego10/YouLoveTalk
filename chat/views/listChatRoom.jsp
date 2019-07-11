<%@ page language="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<html>

<head>
<meta charset="EUC-KR">
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!--  ///////////////////////// Bootstrap, jQuery CDN ////////////////////////// -->
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" 
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>

<!-- Bootstrap Dropdown Hover CSS -->
<link href="/css/animate.min.css" rel="stylesheet">
<link href="/css/bootstrap-dropdownhover.min.css" rel="stylesheet">
<!-- Bootstrap Dropdown Hover JS -->
<script src="/javascript/bootstrap-dropdownhover.min.js"></script>

<!-- jQuery UI toolTip 사용 CSS-->
<link rel="stylesheet"
	href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<!-- jQuery UI toolTip 사용 JS-->
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

<!--  ///////////////////////// CSS ////////////////////////// -->
<style>
body {
	padding-top: 50px;
}
</style>

<script type="text/javascript">
	
</script>
</head>

<body>
    <form class="form-inline" name="detailForm">
    <div class="container">
        
        <div class="col-lg-12">
            
            <div class="page-header text-info">
                <h1 class="h3 mb-3 font-weight-normal">YouLoveTalk</h1>
            </div>
            
            <!-- 검색 관련된거는 일단 보류
            <div class="col-md-6 text-right">
                <div class="form-group">
                    <select class="form-control" name="searchCondition">
                        <option value="">검색조건</option>
                        <option value="0" ${!empty search.searchCondition && search.searchCondition==0 ? "selected":""}>상품번호</option>
                        <option value="1" ${!empty search.searchCondition && search.searchCondition==1 ? "selected":""}>상품명</option>
                        <option value="2" ${!empty search.searchCondition && search.searchCondition==2 ? "selected":""}>상품가격</option>
                    </select>
                </div>
    
                <div class="form-group">
                    <label class="sr-only" for="searchKeyword">검색어</label> 
                        <input type="text" class="form-control" id="searchKeyword" name="searchKeyword" placeholder="검색어"
                            value="${! empty search.searchKeyword ? search.searchKeyword : '' }">
                </div>
                
                <button type="button" id="search" class="btn btn-default">검색</button>
                <input type="hidden" id="currentPage" name="currentPage" value="${search.currentPage}" />
            </div>-->
            
            <div class="col">
                <i class="fas fa-plus" id="createChatRoom"></i>
                
            </div>

                    <div class="col">
                        <input type="text" id="userId"  class="form-control" placeholder="Email Address & Phone Number" style="width: 400px;" autofocus>
                        <br>
                        <input type="password" id="password" class="form-control" placeholder="Password" >
                        <br>
                        <div id="errorMessage" style="font-size: 12px; color: red"></div>
                        <br>
                    </div>
                    
                                  <div class="row">
                              <div class="col-lg-6">
                                  <input type="button"  class="btn btn-primary btn-block" id="login" value="로그인">
                                  </div>
                                  <div class="col-lg-6">
                                  <input type="button"  class="btn btn-primary btn-block" id="signUp" value="회원가입">
                                  </div>
                                  </div>
                                  <br>
                                  <input type="button"  class="btn btn-lg-6 btn-primary btn-block" id="findInfo" value="아이디/비밀번호찾기">
                                  
                      
                    </div>
                </div>
            </div>
        </form>
</body>
</html>
