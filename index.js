class User{
  constructor(email, password, firstName, lastName, birthDate) {
    this.id = guidGenerator()
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.favorites = []
  }
}

class Flat{
  constructor(city, streetName, streetNumber, areaSize, hasAC, yearBuilt, rentPrice, dateAvailable) {
    this.id = guidGenerator()
    this.city = city;
    this.streetName = streetName;
    this.streetNumber = streetNumber;
    this.areaSize = areaSize;
    this.hasAC = hasAC;
    this.yearBuilt = yearBuilt;
    this.rentPrice = rentPrice;
    this.dateAvailable = dateAvailable;
  }

}

function guidGenerator() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

const getUserByEmail = (email, users) => {
  return(users.find(user => user.email === email))
}

const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user))
}

const openHomepage = () => {
  console.log("trying to access home page...")
  window.location.assign("/index.html")
}

const verifyAuth = () => {
  console.log("verify")
  if(window.location.pathname === "/index.html" || 
    window.location.pathname === "/update-profile/index.html" ||
    window.location.pathname === "/new-flat/index.html" ||
    window.location.pathname === "/all-flats/index.html"
  ){
    const user = JSON.parse(localStorage.getItem("user"))
    if(!user){
      window.location.assign("/signin/index.html")
    }
  }
}

verifyAuth()

const editUserInUsers = (newUserValue) => {
  let users = JSON.parse(localStorage.getItem("users"))

  let indexOfUser = users.indexOf(users.find( currentUser => currentUser.id === newUserValue.id))

  users[indexOfUser] = newUserValue

  localStorage.setItem("users", JSON.stringify(users))
  
}

const resetUser = () => {
  let emailErrorMessageElement = document.getElementById("emailErrorMessage")

  emailErrorMessageElement.style.display = "none"

  let email = document.getElementById('emailForgot').value;

  let users = JSON.parse(localStorage.getItem("users"))

  let indexOfUser = users.indexOf(users.find( currentUser => currentUser.email === email))
  if(indexOfUser < 0) {
    emailErrorMessageElement.textContent = "Invalid email"
    emailErrorMessageElement.style.display = "block"
  }else{
    document.getElementById("formEmailForgot").style.display = "none"
    document.getElementById("registerOnResetPassword").style.display = "block"
    document.getElementById('email').value = email
  }
}

const endResetPassword = () => {
  let email = document.getElementById('email').value;
  let users = JSON.parse(localStorage.getItem("users"))
  console.log(users)

  let indexOfUser = users.indexOf(users.find( currentUser => currentUser.email === email))
  console.log(indexOfUser)
  if(indexOfUser < 0) {
    alert("Invalid email")
  }else{
    users.splice(indexOfUser, 1)
    localStorage.setItem("users", JSON.stringify(users))
    signUp()
  }
}

const logOut = () => {
  localStorage.removeItem("user")
  window.location.replace("/signin/index.html")
}

const openLogin = () => {
  window.location.replace("/signin/index.html")
}

const openSignup = () => {
  window.location.replace("/signup/index.html")
}

const signUp = () => {
  let passwordErrorMessageElement = document.getElementById("passwordErrorMessage")
  let passwordConfirmationErrorMessage = document.getElementById("passwordConfirmationErrorMessage")
  let emailErrorMessageElement = document.getElementById("emailErrorMessage")

  emailErrorMessageElement.style.display = "none"

  passwordErrorMessageElement.style.display = "none"
  passwordConfirmationErrorMessage.style.display = "none"

  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let passwordConfirmation = document.getElementById('passwordConfirmation').value;
  let firstName = document.getElementById('firstName').value;
  let lastName = document.getElementById('lastName').value;
  let birthDate = document.getElementById('birthDate').value;

  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

  if(!regex.test(password)){ 
    passwordErrorMessageElement.innerHTML = "password must contain: </br> - letters</br> - numbers</br> - a character that is neither a letter nor a number"

    passwordErrorMessageElement.style.display = "block"
    return 0;
  }
  if(password != passwordConfirmation){
    passwordErrorMessageElement.textContent = "Password and Password Confirmation must be the same"
    passwordConfirmationErrorMessage.textContent = "Password and Password Confirmation must be the same"

    passwordErrorMessageElement.style.display = "block"
    passwordConfirmationErrorMessage.style.display = "block"
    return 0;
  }
  

  let newUser = new User(email, password, firstName, lastName, birthDate);

  if(!localStorage.getItem("users")){
    let newStorage = [newUser]
    localStorage.setItem("users", JSON.stringify(newStorage))
    
  }else{
    console.log("creating user")
    let users = JSON.parse(localStorage.getItem("users"))
  
    let user = getUserByEmail(email, users)
  
    if(user){
      emailErrorMessageElement.textContent = "Email already in use"
      emailErrorMessageElement.style.display = "block"
      return 0;
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    setUser(newUser)
  }

  openHomepage()
  
}

const signIn = () => {
  let passwordErrorMessageElement = document.getElementById("passwordErrorMessage")
  let emailErrorMessageElement = document.getElementById("emailErrorMessage")

  passwordErrorMessageElement.style.display = "none"
  emailErrorMessageElement.style.display = "none"

  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;

  let users = JSON.parse(localStorage.getItem("users"))

  let user = getUserByEmail(email, users)

  if(!user){
    emailErrorMessageElement.textContent = "Invalid email"
    emailErrorMessageElement.style.display = "block"
  }else{
    if(user.password != password){
      passwordErrorMessageElement.textContent = "Invalid password"
      passwordErrorMessageElement.style.display = "block"
    }else{
      setUser(user)
      openHomepage()
    }
  }

}

const renderUpdateProfileValues = () => {
  const user = JSON.parse(localStorage.getItem("user"))

  document.getElementById('email').value = user.email;
  document.getElementById('password').value = user.password;
  document.getElementById('firstName').value = user.firstName;
  document.getElementById('lastName').value = user.lastName;
  document.getElementById('birthDate').value = user.birthDate;
}

const updateProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"))

  user.email = document.getElementById('email').value;
  user.password = document.getElementById('password').value;
  user.firstName = document.getElementById('firstName').value;
  user.lastName = document.getElementById('lastName').value;
  user.birthDate = document.getElementById('birthDate').value;

  localStorage.setItem("user", JSON.stringify(user))

  editUserInUsers(user)

  openHomepage()
}

const openModalMenu = () => {
  const menuModal = document.getElementById("menuModalContainer")
  menuModal.style.display = "block"
}

const closeModalMenu = () => {
  const menuModal = document.getElementById("menuModalContainer")
  menuModal.style.display = "none"
}

const openModalFilter = () => {
  const filterModal = document.getElementById("filterModalContainer")
  filterModal.style.display = "block"
}

const closeModalFilter= () => {
  const filterModal = document.getElementById("filterModalContainer")
  filterModal.style.display = "none"
}

//FLATS FUNCTIONS

const renderFlats = (flats) => {
  document.getElementById("flatsWrapper").innerHTML = ""

  const user = JSON.parse(localStorage.getItem("user"))

  if(!flats || flats.length === 0){
    const renderFlatsLocation = document.getElementById("flatsWrapper")
    const noResultsTitle = document.createElement("h1")
    noResultsTitle.textContent = "No results"

    renderFlatsLocation.appendChild(noResultsTitle)
    return 0;
  }

  flats.forEach(flat => {
    const renderFlatsLocation = document.getElementById("flatsWrapper")
    const flatContainer = document.createElement("div")
    flatContainer.classList.add("individualFlatContainer")

    const cityDiv = document.createElement("div")
    cityDiv.classList.add("dataRow")

    const cityLabel = document.createElement("div")
    cityLabel.textContent = `City`
    cityLabel.classList.add("elementDataRow")

    const cityTitle = document.createElement("elementDataRow")
    cityTitle.textContent = flat.city
    cityTitle.classList.add("elementDataRow")

    cityDiv.appendChild(cityLabel)
    cityDiv.appendChild(cityTitle)

    const streetNameDiv = document.createElement("div")
    streetNameDiv.classList.add("dataRow")

    const streetNameLabel = document.createElement("div")
    streetNameLabel.textContent = `Street Name`
    streetNameLabel.classList.add("elementDataRow")

    const streetName = document.createElement("div")
    streetName.textContent = flat.streetName
    streetName.classList.add("elementDataRow")

    streetNameDiv.appendChild(streetNameLabel)
    streetNameDiv.appendChild(streetName)

    const streetNumberDiv = document.createElement("div")
    streetNumberDiv.classList.add("dataRow")

    const streetNumberLabel = document.createElement("div")
    streetNumberLabel.textContent = `Street Number`
    streetNumberLabel.classList.add("elementDataRow")

    const streetNumber = document.createElement("div")
    streetNumber.textContent = flat.streetNumber
    streetNumber.classList.add("elementDataRow")

    streetNumberDiv.appendChild(streetNumberLabel)
    streetNumberDiv.appendChild(streetNumber)

    const areaSizeDiv = document.createElement("div")
    areaSizeDiv.classList.add("dataRow")

    const areaSizeLabel = document.createElement("div")
    areaSizeLabel.textContent = `Area Size`
    areaSizeLabel.classList.add("elementDataRow")

    const areaSize = document.createElement("div")
    areaSize.textContent = flat.areaSize
    areaSize.classList.add("elementDataRow")

    areaSizeDiv.appendChild(areaSizeLabel)
    areaSizeDiv.appendChild(areaSize)

    const hasAcDiv = document.createElement("div")
    hasAcDiv.classList.add("dataRow")

    const hasAcLabel = document.createElement("div")
    hasAcLabel.textContent = `Has AC`
    hasAcLabel.classList.add("elementDataRow")

    const hasAc = document.createElement("div")
    if(flat.hasAC){
      hasAc.textContent = "Yes"
    }else{
      hasAc.textContent = "no"
    }

    hasAc.classList.add("elementDataRow")

    hasAcDiv.appendChild(hasAcLabel)
    hasAcDiv.appendChild(hasAc)


    const yearBuiltDiv = document.createElement("div")
    yearBuiltDiv.classList.add("dataRow")

    const yearBuiltLabel = document.createElement("div")
    yearBuiltLabel.textContent = `Year Built`
    yearBuiltLabel.classList.add("elementDataRow")

    const yearBuilt = document.createElement("div")
    yearBuilt.textContent = flat.yearBuilt
    yearBuilt.classList.add("elementDataRow")

    yearBuiltDiv.appendChild(yearBuiltLabel)
    yearBuiltDiv.appendChild(yearBuilt)

    const rentPriceDiv = document.createElement("div")
    rentPriceDiv.classList.add("dataRow")

    const rentPriceLabel = document.createElement("div")
    rentPriceLabel.textContent = `Rent Price`
    rentPriceLabel.classList.add("elementDataRow")

    const rentPrice = document.createElement("div")
    rentPrice.textContent = flat.rentPrice
    rentPrice.classList.add("elementDataRow")

    rentPriceDiv.appendChild(rentPriceLabel)
    rentPriceDiv.appendChild(rentPrice)

    const dateAvailableDiv = document.createElement("div")
    dateAvailableDiv.classList.add("dateAvailableRow")

    const dateAvailableLabel = document.createElement("div")
    dateAvailableLabel.textContent = `Date Available`
    dateAvailableLabel.classList.add("elementDataRow")

    const dateAvailable = document.createElement("div")
    dateAvailable.textContent = flat.dateAvailable
    dateAvailable.classList.add("elementDataRow")

    dateAvailableDiv.appendChild(dateAvailableLabel)
    dateAvailableDiv.appendChild(dateAvailable)

    const favoriteContainer = document.createElement("div")
    favoriteContainer.classList.add("favoriteImageContainer")
    favoriteContainer.onclick = () => addFlatToFavorites(flat)

    const favorite = document.createElement("img")
    favorite.classList.add("favoriteImage")
    if(verifyIfIsFavorite(flat, user.favorites)){
      favorite.src = "/images/hearthChecked.png"
    }else{
      favorite.src = "/images/hearthUnchecked.png"
    }

    favoriteContainer.appendChild(favorite)

    flatContainer.appendChild(cityDiv)
    flatContainer.appendChild(streetNameDiv)
    flatContainer.appendChild(streetNumberDiv)
    flatContainer.appendChild(areaSizeDiv)
    flatContainer.appendChild(hasAcDiv)
    flatContainer.appendChild(yearBuiltDiv)
    flatContainer.appendChild(rentPriceDiv)
    flatContainer.appendChild(dateAvailableDiv)
    flatContainer.appendChild(favoriteContainer)

    renderFlatsLocation.appendChild(flatContainer)
    
  });
  closeModalFilter()
}

const renderFlatsAllFlatsPage = () => {
  const flats = JSON.parse(localStorage.getItem("flats"))

    let flatsFiltered = filter(flats)
    let flatsSorted = sort(flatsFiltered)
    renderFlats(flatsSorted)
  

}

const renderFavoritesFlats = () => {
  let flats = JSON.parse(localStorage.getItem("user")).favorites

  renderFlats(flats)

  
}

const verifyIfIsFavorite = (flat, favoriteFlats) => {
  const flatExist = favoriteFlats.find(currentFlat => 
    currentFlat.id === flat.id
  )

  if(flatExist){
    return true
  }else{
    return false
  }
}

const addFlatToFavorites = (flat) => {
  const user = JSON.parse(localStorage.getItem("user"))
  let favorites = []
  const isFavorite = verifyIfIsFavorite(flat, user.favorites)

  if(isFavorite){
    favorites = user.favorites.filter(currentFlat => 
      currentFlat.id != flat.id )
      user.favorites = favorites

  }else{
    user.favorites.push(flat)  
  }
  
  localStorage.setItem("user", JSON.stringify(user))

  editUserInUsers(user)

  let favoritesPage = false

  if(window.location.pathname === "/index.html"){
    favoritesPage = true
  }
  let flats = favoritesPage ? JSON.parse(localStorage.getItem("user")).favorites : JSON.parse(localStorage.getItem("flats"))

  if(window.location.pathname === "/all-flats/index.html"){
    renderFlatsAllFlatsPage(flats)
  }
  if(window.location.pathname === "/index.html"){
    renderFlats(flats)
  }
  
}

const addFlat = () => {
  let city = document.getElementById('city').value;
  let streetName = document.getElementById('streetName').value;
  let streetNumber = document.getElementById('streetNumber').value;
  let areaSize = document.getElementById('areaSize').value;
  let hasAc = document.getElementById('hasAc').checked;
  let yearBuilt = document.getElementById('yearBuilt').value;
  let rentPrice = document.getElementById('rentPrice').value;
  let dateAvailable = document.getElementById('dateAvailable').value;

  let newFlat = new Flat(city, streetName, streetNumber, areaSize, hasAc, yearBuilt, rentPrice, dateAvailable)

  if(!localStorage.getItem("flats")){
    let newFlatsStorage = [newFlat]
    localStorage.setItem("flats", JSON.stringify(newFlatsStorage))
    addFlatToFavorites(newFlat)

    openHomepage()
  }else{
    let flats = JSON.parse(localStorage.getItem("flats"))

    flats.push(newFlat)

    localStorage.setItem("flats", JSON.stringify(flats))


    addFlatToFavorites(newFlat)

    openHomepage()
  }
}

const userSession = JSON.parse(localStorage.getItem("user"))

document.getElementById("username").textContent = `Hello ${userSession.firstName} ${userSession.lastName}`
document.getElementById("usernamePc").textContent = `Hello ${userSession.firstName} ${userSession.lastName}`

//Filters functions

const filter = (flats) => {

  const city = document.getElementById("city").value
  const minPrice = document.getElementById("minPrice").value
  const maxPrice = document.getElementById("maxPrice").value
  const minArea = document.getElementById("minArea").value
  const maxArea = document.getElementById("maxArea").value

  if(city){
    flats = flats.filter(flat => flat.city.toUpperCase().includes(city.toUpperCase()))
  }
  if(minPrice){
    flats = flats.filter(flat => flat.rentPrice >= minPrice)
  }
  if(maxPrice){
    flats = flats.filter(flat => flat.rentPrice <= maxPrice)
  }
  if(minArea){
    flats = flats.filter(flat => flat.areaSize >= minArea)
  }
  if(maxArea){
    flats = flats.filter(flat => flat.areaSize <= maxArea)
  }

  console.log(flats)
  
  return flats
}

const sort = (flats) => {

  const sort = document.getElementById("selectSort").value

  if(sort === "city-a-z"){
    console.log("testing city sorting A-Z")
    flats.sort((a, b) => {
      const flatA = a.city.toUpperCase(); 
      const flatB = b.city.toUpperCase(); 
      if (flatA < flatB) {
        return -1;
      }
      if (flatA > flatB) {
        return 1;
      }
      return 0;
    })

    console.log(flats)
  }else if(sort === "city-z-a"){
    console.log("testing city sorting Z-A")
    flats.sort((a, b) => {
      const flatA = a.city.toUpperCase(); 
      const flatB = b.city.toUpperCase(); 
      if (flatA > flatB) {
        return -1;
      }
      if (flatA < flatB) {
        return 1;
      }
      return 0;
    })

    console.log(flats)
  }else if(sort === "price-l-h"){
    console.log("testing price sorting low - high")
    flats.sort((a, b) => a.rentPrice - b.rentPrice);
    console.log(flats)
  }else if(sort ==="price-h-l"){
    console.log("testing price sorting high - low")
    flats.sort((a, b) => {
      if (a.rentPrice > b.rentPrice) {
        return -1;
      }
      if (a.rentPrice < b.rentPrice) {
        return 1;
      }
      return 0;
    })
    console.log(flats)
  }else if(sort === "area-l-h"){
    console.log("testing area sorting low - high")
    flats.sort((a, b) => a.areaSize - b.areaSize);
    console.log(flats)
  }else if(sort ==="area-h-l"){
    console.log("testing area sorting high - low")
    flats.sort((a, b) => {
      if (a.areaSize > b.areaSize) {
        return -1;
      }
      if (a.areaSize < b.areaSize) {
        return 1;
      }
      return 0;
    })
    console.log(flats)
  }

  return flats
}

closeModalMenu()
