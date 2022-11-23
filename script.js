let products = [];
axios
  .get(`https://dh.cubicle.53xapps.com/products`)
  .then((response) => {
    products = response.data.slice(19, 39);
    render(products);
    getQuantity(basketQuantity);
  })
  //Здесь функция для рейтинга товара, взял с интернета
  .then(() => {
    const ratings = document.querySelectorAll(`.rating`);
    if (ratings.length > 0) {
      initRatings();
    }

    function initRatings() {
      let ratingActive, ratingValue;
      for (let index = 0; index < ratings.length; index++) {
        const rating = ratings[index];
        initRating(rating);
      }

      function initRating(rating) {
        initRatingVars(rating);
        setRatingActiveWidth();
        if (rating.classList.contains(`rating_set`)) {
          setRating(rating);
        }
      }

      function initRatingVars(rating) {
        ratingActive = rating.querySelector(`.rating_active`);
        ratingValue = rating.querySelector(`.rating_value`);
      }

      function setRatingActiveWidth(index = ratingValue.innerHTML) {
        const ratingActiveWidth = index / 0.05;
        ratingActive.style.width = `${ratingActiveWidth}%`;
      }
      function setRating(rating) {
        const ratingItems = rating.querySelectorAll(`.rating_item`);
        for (let index = 0; index < ratingItems.length; index++) {
          const ratingItem = ratingItems[index];
          ratingItem.addEventListener(`mouseenter`, function (e) {
            initRatingVars(rating);
            setRatingActiveWidth(ratingItem.value);
          });
          ratingItem.addEventListener(`mouseleave`, function (e) {
            setRatingActiveWidth();
          });
          ratingItem.addEventListener(`click`, function (e) {
            initRatingVars(rating);
            if (rating.dataset.ajax) {
              setRatingValue(ratingItem.value, rating);
            } else {
              ratingValue.innerHTML = index + 1;
            }
            setRatingActiveWidth();
          });
        }
      }
    }
  })
  //Здесь функция для рейтинга товара, взял с интернета
  .then(() => {
    //Sort from Min to Max
    let sortMax = document.querySelector(`.maxprice`);
    sortMax.addEventListener(`click`, mySort1);
    function mySort1() {
      let parent = document.querySelector(`.main_block`);
      for (let i = 0; i < parent.children.length; i++) {
        for (let j = i; j < parent.children.length; j++) {
          if (
            +parent.children[i].getAttribute(`data-price`) >
            +parent.children[j].getAttribute(`data-price`)
          ) {
            let replacedChild = parent.replaceChild(
              parent.children[j],
              parent.children[i]
            );
            insertAfter(replacedChild, parent.children[i]);
          }
        }
      }
    }

    function insertAfter(elem, refElem) {
      return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
    }

    //Sort from Max to Min
    let sortMin = document.querySelector(`.minprice`);
    sortMin.addEventListener(`click`, mySort2);
    function mySort2() {
      let parent = document.querySelector(`.main_block`);
      for (let i = 0; i < parent.children.length; i++) {
        for (let j = i; j < parent.children.length; j++) {
          if (
            +parent.children[i].getAttribute(`data-price`) <
            +parent.children[j].getAttribute(`data-price`)
          ) {
            let replacedChild = parent.replaceChild(
              parent.children[j],
              parent.children[i]
            );
            insertAfter(replacedChild, parent.children[i]);
          }
        }
      }
    }

    function insertAfter(elem, refElem) {
      return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
    }
  });

//Загружаем наши товары на страничку
function render(productsList) {
  renderBasket();
  let blocks = document.querySelector(`.main_block`);
  blocks.innerHTML = "";
  for (let product of productsList) {
    let block = document.createElement(`div`);
    block.classList.add(`new_wrp`);
    block.dataset.price = `${product.price}`;
    const html = `
    <div class="block_container">
    <img src="${product.photo.front}" class="block_img" width="220px" height="300px" style="margin-left:25px;margin-top:15px">
    <div class="block_body">
    <div class="rating rating_set">
    <div class="rating_body">
      <div class="rating_active"></div>
      <div class="rating_items">
<input type="radio" class="rating_item" value="1" name="rating">
<input type="radio" class="rating_item" value="2" name="rating">
<input type="radio" class="rating_item" value="3" name="rating">
<input type="radio" class="rating_item" value="4" name="rating">
<input type="radio" class="rating_item" value="5" name="rating">
      </div>
    </div>
    <div class="rating_value"></div>
   </div>
<h4 class="colorChange" style="text-align:center ;">${product.title}</h4>
<h3 class='' style="margin-left:35px;">${product.price} RUB <img  class="add_logo addToCart" src="img/add.png" width="25px" height="25px" style="margin-top:-5px; "></h3>
    </div>
  </div>
    `;
    block.innerHTML = html;
    blocks.appendChild(block);

    //При клике информация о товаре будет отправляться в LocalStorage
    let miniBasket = block.querySelector(`.addToCart`);
    miniBasket.addEventListener("click", addToCart);
    function addToCart() {
      product.quantity = 1;
      let dataToCart = JSON.stringify(product);
      localStorage.setItem(`${product.id}`, dataToCart);
      makeGreen();
      renderBasket();
    }
    function makeGreen() {
      let keys = Object.keys(localStorage);
      if (product.id in localStorage) {
        let added = block.querySelector(`.colorChange`);
        added.classList.add(`makeGreen`);
      }
    }
    makeGreen();

    //Создаем модальное окно
    let modalBlockOpen = block.firstChild.nextSibling;
    //Дабы избежать срабатывания события на отступах карточки
    modalBlockOpen.addEventListener(`click`, function (event) {
      if (event.target.classList.contains(`add_logo`)) {
        return false;
      } else if (
        event.target.classList.contains(
          `rating_item` || `rating_body` || "rating_set"
        )
      ) {
        return false;
      }

      let modal = document.querySelector(`.modal_card`);
      modal.removeChild(modal.firstChild);
      let newP = document.createElement(`div`);
      newHtml = `
      <hr style="border: 2px solid rgb(85, 22, 22);margin-top:10px" />
      <div class="modal_card">
      <div class="content_wrapper">
    <img  class="sldbtn" src="img/left-arrow.png" width="25px" height="25px">
        <div class="block_container_2">
          <img
            src="${product.photo.front}"
            class="block_img_2"
            style="margin-left: 25px; margin-top: 15px"
          />
          <div class="block_body 2">
            <h4 class="colorChange2" style="text-align: center">${product.title}</h4>
            <h3 style="margin-left: 35px">
              ${product.price} RUB
              <img
                class="add_logo"
                src="img/add.png"
                width="25px"
                height="25px"
                style="margin-top: -5px"
              />
            </h3>
          </div>
        </div>
        <img class="sldbtn2" src="img/right-arrow.png" width="25px" height="25px">
        <div class="modal_desc">
          <h4>Диагональ: ${product.description.diag} дюйм</h4>
          <h4>Разрешение: ${product.description.pixel} </h4>
          <h4>Память: ${product.description.memory} Гб</h4>
          <h4>Камера: ${product.description.camera} МП</h4>
          <h4>Система: ${product.description.system}</h4>
          <img class="close" src="img/clear.png" width="50px" height="50px">
        </div>
      </div>
    </div>
      `;
      newP.innerHTML = newHtml;
      modal.appendChild(newP);

      let dialogBasket = modal.querySelector(`.add_logo`);
      dialogBasket.addEventListener("click", addToCart2);
      function addToCart2() {
        product.quantity = 1;
        let dataToCart = JSON.stringify(product);
        localStorage.setItem(`${product.id}`, dataToCart);
        makeGreen();
        renderBasket();
      }

      function makeGreen() {
        let keys = Object.keys(localStorage);
        if (product.id in localStorage) {
          let added = modal.querySelector(`.colorChange2`);
          added.classList.add(`makeGreen`);
        }
      }
      makeGreen();

      let dialog = document.querySelector(`.dialog`);
      dialog.classList.remove(`none`);
      dialog.addEventListener(`click`, function (event) {
        if (event.target.dataset.type === `close`) {
          dialog.classList.add(`none`);
        }
      });

      let close = document.querySelector(`.close`);
      close.addEventListener(`click`, () => {
        dialog.classList.add(`none`);
      });
      //Создаем массив фоток для карусели для каждой карточки
      let photoMass = [
        product.photo.front,
        product.photo.back,
        product.photo.third,
      ];
      //Получаем доступ ко кнопкам нашего слайдера
      let photoAccess = document.querySelector(`.block_img_2`);
      let num = 0;
      let sldbtn = document.querySelector(`.sldbtn`);
      sldbtn.addEventListener(`click`, () => {
        num--;
        if (num < 0) {
          num = photoMass.length - 1;
          photoAccess.src = photoMass[num];
          photoAccess.style.width = `200px`;
          photoAccess.style.marginLeft = `35px`;
        } else if (num === 0) {
          photoAccess.src = photoMass[num];
        } else if (num <= photoMass.length - 2) {
          photoAccess.src = photoMass[num];
          photoAccess.style.width = `200px`;
          photoAccess.style.marginLeft = `35px`;
        }
      });

      let sldbtn2 = document.querySelector(`.sldbtn2`);
      sldbtn2.addEventListener(`click`, () => {
        num++;
        num %= photoMass.length;
        if (num <= photoMass.length - 2 && num !== 0) {
          photoAccess.src = photoMass[num];
          photoAccess.style.width = `200px`;
          photoAccess.style.marginLeft = `35px`;
        } else if (num === 0) {
          photoAccess.src = photoMass[num];
        } else if (num === photoMass.length - 1) {
          photoAccess.src = photoMass[num];
          photoAccess.style.width = `200px`;
          photoAccess.style.marginLeft = `35px`;
        }
      });
    });
  }

  function renderBasket() {
    //Для доступа к этой функции из кнопки добавления в корзину miniBasket() пришлось дублировать эти две строчки.
    let keys = Object.keys(localStorage);
    let basketQuantity = keys.length;

    //Данная функция будет выдавать информацию о пустой корзине после проверки
    function checkBox() {
      let emptyBasket = document.querySelector(`.if_empty`);
      if (basketQuantity > 0) {
        emptyBasket.classList.add(`none`);
      }
      if (basketQuantity === 0) {
        emptyBasket.classList.remove("none");
      }
    }
    checkBox();
    //Данная функция будет выдавать информацию о пустой корзине после проверки

    let basketWrapper = document.querySelector(`.product_items`);
    basketWrapper.innerHTML = "";
    let mass = [];
    for (let key of keys) {
      let data = JSON.parse(localStorage.getItem(key));
      let newItem = document.createElement(`div`);
      newItem.classList.add(`oneCart`);
      //Открываем доступ к корзине
      basketHTML = `
            <div class="product_item" data-price2=${data.price}>
            <img src="${data.photo.front}" width="50px" height="60px" class="item_photo">
            <div class="item_info">
              <div class="product_title">${data.title}</div>
              <div class="">
                <span class="price_title">Цена: </span><span class="item_price">${data.price}</span> <span>RUB</span>
              <button class="add">+</button>
              <input type="text" class="type_number" value="${data.quantity}" disabled>
              <button class="minus" >-</button><br>
              <span>Количество: <span class='quantity'>${data.quantity}</span> </span>
              </div>
            </div>
            <img class="delete_item" src="img/free-icon-bin-5375931.png">
          </div>
            `;
      newItem.innerHTML = basketHTML;
      basketWrapper.appendChild(newItem);

      let inputValue = newItem.querySelector(`.type_number`);
      let quantity = newItem.querySelector(`.quantity`);
      let newPrice = newItem.querySelector(`.item_price`);
      newPrice.innerHTML = data.price * inputValue.value;
      let deleteItem = newItem.querySelector(`.delete_item`);
      let getFullPrice = document.querySelector(`.getFullPrice`);

      //Делаем функционал внутри корзины (+)
      let add = newItem.querySelector(`.add`);
      add.addEventListener(`click`, () => {
        inputValue.value++;
        quantity.innerHTML = inputValue.value;
        newPrice.innerHTML = data.price * inputValue.value;
        //После каждого действия необходимо передать в локальное хранилище новые данные
        data.quantity = Number(quantity.textContent);
        localStorage.setItem(data.id, [JSON.stringify(data)]);
        checkBox();
        renderBasket();
      });
      //Делаем функционал внутри корзины (-)
      let minus = newItem.querySelector(`.minus`);
      minus.addEventListener(`click`, () => {
        if (inputValue.value > 1) {
          inputValue.value--;
          quantity.innerHTML = inputValue.value;
          let help = newPrice.innerHTML;
          newPrice.innerHTML = help - data.price;
          //После каждого действия необходимо передать в локальное хранилище новые данные
          data.quantity = Number(quantity.textContent);
          localStorage.setItem(data.id, [JSON.stringify(data)]);
          checkBox();
          renderBasket();
        }
      });

      //Delete all Products from Basket
      let clearBasket = document.querySelector(`.clearBasket`);
      clearBasket.addEventListener(`click`, () => {
        localStorage.clear();
        renderBasket();
        getFullPrice.innerHTML = 0;
      });
      function FullPrice() {
        if (Object.keys(localStorage).length === 0) {
          getFullPrice.innerHTML = 0;
        } else {
          mass.push(Number(newPrice.innerHTML));
          let AllSumm = mass.reduce((a, b) => a + b, 0);
          getFullPrice.innerHTML = AllSumm;
        }
      }
      FullPrice();
      //DeleteItem
      deleteItem.addEventListener(`click`, () => {
        localStorage.removeItem(key);
        FullPrice();
        renderBasket();
      });
    }

    //Отсюда сразу передадим кол-во товаров в корзине
    getQuantity(basketQuantity);
  }
}

function getQuantity(basketQuantity) {
  let quantityBasket = document.querySelector(`.cart_quantity`);
  quantityBasket.innerHTML = basketQuantity;
}

const myFilter = document.querySelector(`.filters`);
myFilter.addEventListener(`click`, (select) => {
  //Здесь у меня происходило всплытие и случайно можно было активировать все элементы,
  //поэтому пришел в такому решению
  const brand = select.target.dataset.type;
  if (brand.length > 0) {
    const child = [...myFilter.children];
    child.forEach((el) => {
      el.classList.remove(`active`);
    });
    select.target.classList.add(`active`);
  } else {
    return false;
  }
  filter(brand);
});

function filter(brand) {
  const filterBrand = products.filter((product) => {
    return product.brand_id == brand || brand === "all";
  });
  render(filterBrand);
}

//Открыть корзину
let basket = document.querySelector(`.basket`);

basket.addEventListener(`click`, function () {
  let basketWindow = document.querySelector(`.product_content`);
  basketWindow.classList.remove(`none`);
});
//Закрыть корзину
let closeBasket = document.querySelector(`.closeCart`);
closeBasket.addEventListener(`click`, () => {
  let basketWindow = document.querySelector(`.product_content`);
  basketWindow.classList.add(`none`);
});
let keys = Object.keys(localStorage);
let basketQuantity = keys.length;
