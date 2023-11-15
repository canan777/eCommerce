//console.log('bağlantı kontrol')

const categoryList = document.querySelector("#category-list");
const productsList = document.getElementById("products");
//console.log(productsList);
//console.log(categoryList)

//Sepeti Açma Kapama İşlemi için lazm olan elemanlar

//açma butonu
const openButton = document.querySelector("#open-button");
//console.log(openButton)
//kapama butonu
const closeButton = document.querySelector("#close-button");
//console.log(closeButton)
//sepet modalı
const modal = document.getElementById("modal");
//console.log(modal)
const modalList = document.querySelector(".modal-list");
//console.log(modalList)
const totalPrice = document.getElementById("total-price");
//console.log(totalPrice)

//API ' ye kategi listesi için istek  attığımız ve uygulamada kategorileri bastırmak için fonksiyon
function fetchCategories() {
  //console.log('Fonksiyon çalıştı')

  /**API isteklerinde verinin gelme süreci
   * isteklerin 2 sonucu vardı
   * Olumlu olma durumu (then metoduyla ele alınır)
   * Olumsuz hata döndürme sonucu (error metodu ile ele alınır)
   * Her iki durumda anlık gerçekleşmez belli bir süreç geçer
   * Bunun için async/await yapısı ile veya then/catch yada try catch gibi fonksiyon blokları ile bu istekler yapılır
   *
   *
   */

  //apiye veri çekme isteği atma
  fetch("https://fakestoreapi.com/products")
    //Eğer apiden olumlu sonuc gelmiş ise then bloğu çalışır
    //API den elen ilk cevabı json verisine çeviriyoruz
    .then((response) => response.json())
    //json çevirme işlemide bir süreç alır ve bunun içinde bir then bloğu daha kulllanılır
    .then((data) =>
      //gelen data verisi çok fazla olduğu slice metodu ile diziyi böldük
      //ve bölünmüş olan yeni diziye mapp metodu uygulayarak her bir eleman için işlem gerçkelştirik
      data.slice(0, 5).map((categoryy) => {
        //obje destructor
        //verileri kullanılacak objeden bir kere en başta çıkarıp
        //daha sonra ilgili yerlede sadece keyi yazarak erişmek için yapılır
        const { category, image } = categoryy;

        //console.log(name);
        //console.log(image);
        //map metodu diziiyi dönerken döndğüğü her bir elemean için bir div oluştuyor

        const categoryDiv = document.createElement("div");
        //oluşturaln bu dive istenilen class ekkleniyor
        categoryDiv.classList.add("category");
        //oluşturlmuş olan divin içeriği innerhtml ile düenleniyor
        categoryDiv.innerHTML = `    <img
    src=${image}    alt=""
  />
  <span>${category}</span>`;

        // console.log(categoryDiv);
        //daha sonra js tarafında oluştrualn bu elemanın html tarafında da gözükmesi için appendChild metodu ile html gödneriliyor
        categoryList.appendChild(categoryDiv);
      })
    )
    //Eğer apiden olumsuz sonuc gelmiş ise burdaki blok çalışır
    .catch((error) => console.log(error));
}

fetchCategories();

function fetchProducts() {
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) =>
      data.map((product) => {
        //console.log(product);

        const { title, price, category, image, id } = product;
        //div oluştur
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
<img src=${image} alt="">
<p>${title}</p>
<p>${category}</p>
<div class="product-action">
  <p>${price}₺</p>
  <button onclick="addToBasket({id:${id},title:'${title}',price:${price},image:'${image}',amount:1})">Sepete Ekle</button>

</div>



`;
        productsList.appendChild(productDiv);
        //  console.log(productDiv)
      })
    )
    .catch((error) => console.log("api hatası", error));
}

fetchProducts();

let basket = [];
let total = 0;

//Sepete Ekleme İşlemleri

function addToBasket(product) {
  //console.log('sepete ekleme fonksiyonu')
  //console.log(product);

  //eğer benım sepetimde
  //dışardan gelen product ile ayı id numrasına sahip elemean varsa
  //o elemanın amount bilgisini arttır

  const idsiaynieleman = basket.find(
    (sepettekiEleman) => sepettekiEleman.id === product.id
  );
  //console.log(idsiaynieleman);

  if (idsiaynieleman) {
    idsiaynieleman.amount++;
  } else {
    basket.push(product);
  }

  // console.log(basket);
}

//Sepet açıldığında seppetteki ürünleri listeleme fonksiyonu
function showBasketItems() {
  // console.log('sepeti listeleme')
  //tüm sepet dizimi dön 
  basket.map((basketProduct) => {
    //her bir sepet elemanı için bir div oluştur
    const listItem = document.createElement("div");
    //bu dive list-item classını ekle
    listItem.classList.add("list-item");

    //console.log(basketProduct);
    const {image,title,price,amount,id,}=basketProduct

    //oluşturdğun listItem divini içeriğine html olarak eleman ekleme
    listItem.innerHTML = `

<img
src=${image}
alt=""
/>
<h4>${title}</h4>
<h4 class="price">${price}₺</h4>
<p>Miktar: ${amount}</p>
<button class="delete-button"  onclick='deleteItem({id:${id},price:${price},amount:${amount}})' >Sil</button>
`;

//oluştraln divi html tarafına gönderme
    modalList.appendChild(listItem);

    // console.log(listItem);

    total += price * amount;
  });
}

//Sepet Açma Kapama İşlemleri
//sepet butonuna ıklandığı anın olayını dinliyoruz
openButton.addEventListener("click", () => {
  //console.log('sepet butonuna tıklandı')
  showBasketItems();
  //html de oluştrduğumuz modala active classını eklıyoruz
  modal.classList.add("active");
  totalPrice.innerText = total;
});

//çarpı resmine tıklanma anını yaklalıyoruz
closeButton.addEventListener("click", () => {
  //modal dan active clasını kaldırıyoruz
  modal.classList.remove("active");
  modalList.innerHTML='';
  total=0;
});

//eğer çarpı değilde modalın dışında gri alana tıklanınca kapatmak için
//modalın tıklanma olayını dinlıyoruz
modal.addEventListener("click", (event) => {
  //tıklanma olayından dönen etkinlği analiz edip
  //console.log(event.target)

  //tıklanılan elemanın classları eğer modal-wrapper içeriyorsa (yani gri alan tıklandıysa)
  if (event.target.classList.contains("modal-wrapper")) {
    //modal dan active clasını kaldırıyoruz
    modal.classList.remove("active");
  }
  //modal.classList.remove('active')
});

/*Silme İşlemi */

function deleteItem(willDeleteItem) {
  //console.log(willDeleteItem);
  console.log('silmeden önce',basket)
  /**filter metodu tüm diziyi gezer ve bize her dizi elemanını geri verir.
   * daha sonra bizim yapacağımız kıyasa göre o elemn olmadan bir dizi döner
   * 
   * 
   */

  //Tüm sepeti dön ve eğer sepetteki elemanın idsi benım silinecek
  //elemanınım idsine eşit değilse bunu diziye koy ve bana yeni diziyi geri döndür
  basket=basket.filter((eleman)=>eleman.id !==willDeleteItem.id)
  console.log('sildikten sonra',basket)
//Toplam fiyat bilgisi istenlen eleman silindekten sonra güncellemele
  total -= willDeleteItem.price * willDeleteItem.amount
  //toplam fiyatı htmle gönderme
  totalPrice.innerText=total
}

//Silinen elemanı html tarafında kaldırmak için
modalList.addEventListener('click', (tiklamaOlayiBilgileri) => {

  //hangi elemana tıklandığını tesppit etme
  //console.log(tiklamaOlayiBilgileri.target)

  //eğer benım tıkladığım elemanın classı delete-button içeriyorsa
  if (tiklamaOlayiBilgileri.target.classList.contains('delete-button')) {

    //tıkladığım elemanın bir üst kapsayıcı elemanını htmlden sil
    tiklamaOlayiBilgileri.target.parentElement.remove();
  }
//eğer benım sepetimde eleman yoksa modalı kapat
  if (basket.length === 0) {
//modalın classından active çıkar
    modal.classList.remove('active');
  }
});