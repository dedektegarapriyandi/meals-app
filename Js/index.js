class MealsList extends HTMLElement {
    constructor() {
        super();

        const searchBar=document.getElementById("search-bar");
        const mealsList=document.getElementById("meals-list");
        let meals=[];

        //event listener form cari
        searchBar.addEventListener('keyup',(e)=>{
            const searchString=e.target.value.toLowerCase();
            getResults(searchString);
        })

        //memanggil API
        const getResults=async (searchString)=>{
            try{
                const res= await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchString}`);
                //console.log(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchString}`);
                meals=await res.json();
                if(searchString.length<2){
                    meals.meals=1;
                }
                displayResults(meals.meals);
            } catch(err){
                console.error(err);
            }
        }


        //menampilkan hasil dari API
        const displayResults=(meals)=>{
            let localArray = JSON.parse(localStorage.getItem('favMeals'));
            if(meals===null){
                mealsList.innerHTML='<h1>Nama makanan tidak ditemukan</h1>'
            }
            
            else{
                const mealString=meals.map((meal)=>{
                    let recipeId=meal.idMeal;
                    let isFav=false;
                    if(localArray.indexOf(recipeId) !=-1 ){
                        isFav=true;
                    }
                    return `<div class="meal">
                                <img src="${meal.strMealThumb}" </img>
                                <div class="meal-name" id="${meal.idMeal}">
                                    <h2 class="recipe-name">${meal.strMeal}</h2> 
                                    <i class="${ isFav ? 'fas' : 'far' } fa-heart fav-btn"></i>
                                </div>
                            </div>`;
            
                }).join('');
                this.innerHTML=mealString;
            }
        
        }

        //menginisialisasi local storage
        function initializeLocalstorage(){
            let localArray = [];
            if(localStorage.getItem('favMeals') == null){
                //create a new localStorage
                localStorage.setItem('favMeals',JSON.stringify(localArray));
            }
        }

        //menambah event listener didalam list makanan
        let searchList = document.getElementById('meals-list');
        searchList.addEventListener('click',(e)=>{ 
            if(e.target.className == 'recipe-name'){
                let recipeId= e.target.parentNode.id;
                window.location.href = `recipe.html?id=${recipeId}`;
            }else if(e.target.classList.contains('fav-btn')){
                let recipeId=e.target.parentNode.id;
                console.log(recipeId);
                let localArray = JSON.parse(localStorage.getItem('favMeals'));
                if(localArray.indexOf(recipeId) != -1 ){
                    localArray=localArray.filter((item)=> item != recipeId)
                    localStorage.setItem('favMeals',JSON.stringify(localArray));
                    e.target.classList.remove('fas');
                    e.target.classList.add('far');
                    console.log(localStorage);
                }else{
                    localArray.push(recipeId);
                    localStorage.setItem('favMeals',JSON.stringify(localArray));
                    e.target.classList.remove('far');
                    e.target.classList.add('fas');
                    alert('Added to Favourites')
                    console.log(localStorage);
                }
            }
        })


        //memanggil local storage
        document.addEventListener('DOMContentLoaded',initializeLocalstorage);
    }
}

window.customElements.define("meals-list", MealsList);