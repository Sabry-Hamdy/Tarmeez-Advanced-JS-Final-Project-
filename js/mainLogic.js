const baseUrl = "https://tarmeezacademy.com/api/v1";
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const loggedUser = document.querySelector(".logged-user");
const newPostBtn = document.getElementById("create-new-post");

// document.getElementById("status-alert").addEventListener()

function getPosts(page = 1) {
  let url = baseUrl + `/posts?limit=5&page=${page}`;
  // let url = baseUrl + `/posts?limit=5&page=${2535}`;
  showLoader(true);
  axios
    .get(url)
    .then((response) => {
      let posts = response.data.data;
      for (let post of posts) {
        makePost(post);
      }
    })
    .catch((error) => {
      error = error.response.message;
      // console.error(error.response.message);
      showStatusAlert(error, "danger");
    })
    .finally(() => {
      showLoader(false);
    });
}

function makePost(post) {
  let username = post.author.username;
  let profilePic =
    typeof post.author.profile_image === "string" ? post.author.profile_image : "https://cdn3.iconfinder.com/data/icons/basic-ui-element-s94-3/64/Basic_UI_Icon_Pack_-_Glyph_user-512.png";
  let imageUrl = post.image;
  let createdAt = post["created_at"];
  let title = typeof post.title === "string" ? post.title : "";
  let body = post.body;
  let id = post.id;
  let tagsObj = post.tags;

  let user = getCurrentUser();
  let isMyPost = user != null && post.author.id === user.id;
  let editBtn = ``;
  let deleteBtn = ``;

  if (isMyPost) {
    editBtn = `<button class="control-post btn btn-secondary mt-2 me-2" style="float: right" onclick="editBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>`;
    deleteBtn = `<button class="control-post btn btn-danger mt-2 me-2" style="float: right" onclick="deleteBtnClicked(${id})">Delete</button>`;
  }

  let commentsCount = post["comments_count"] === 0 ? "No comments yet" : `${post["comments_count"]} Comments`;

  document.getElementById("posts").innerHTML += `
	<!-- POST -->
          <div class="card shadow-sm mb-3" style="position: relative">
            <div class="card-header">
              <div onclick="userClicked(${post.author.id})" style="cursor: pointer; display: inline-block">
                <img src="${profilePic}" alt="" class="rounded-circle me-2 border border-3" />
                <span>@${username}</span>
              </div>

              ${editBtn}
              ${deleteBtn}
              
            </div>
            <div class="card-body" style="cursor: pointer" id="post-body"  onclick="redirectToPostDetails(${id})">
              <img class="w-100" src="${imageUrl}" alt="" />
              <span class="d-block post-time fw-medium">${createdAt}</span>
              <h5 class="card-title mt-3">${title}</h5>
							<p>${body}</p>
              <hr />
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                <path
                  d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"
                />
              </svg>
              <span>${commentsCount}</span>
              <span id="tags-${id}">
                
              </span>
            </div>
          </div>
          <!--// POST //-->
	`;

  let tagsParent = document.getElementById(`tags-${id}`);
  for (let tag of tagsObj) {
    tagsParent.innerHTML += `
      <span class="bg-secondary px-3 py-1  ms-1 rounded-pill text-white">${tag.name}</span>
    `;
  }
}

function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem("user");

  if (storageUser !== null) {
    user = JSON.parse(storageUser);
  }

  return user;
}

function loginBtnClicked() {
  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;

  const url = baseUrl + "/login";
  const body = {
    username: username,
    password: password,
  };

  showLoader(true);
  axios
    .post(url, body)
    .then((response) => {
      let token = response.data.token;
      let user = response.data.user;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const modal = document.getElementById("login-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      setupUI();

      let userInfo = JSON.parse(localStorage.getItem("user"));
      let name = userInfo.name;
      let message = `Welcome back ${name}!`;
      showStatusAlert(message, "success");
    })
    .catch((error) => {
      error = error.response.data.message;
      validateLogin();
      showStatusAlert(error, "danger");
    })
    .finally(() => {
      showLoader(false);
    });
}

function registerBtnClicked() {
  const nickname = document.getElementById("nickname-input").value;
  const username = document.getElementById("username-register-input").value;
  const email = document.getElementById("email-input").value;
  const password = document.getElementById("password-register-input").value;
  const image = document.getElementById("profile-image").files[0];
  const profileImage = typeof image === "object" ? image : "https://cdn3.iconfinder.com/data/icons/basic-ui-element-s94-3/64/Basic_UI_Icon_Pack_-_Glyph_user-512.png";

  let formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("name", nickname);
  formData.append("email", email);
  formData.append("image", profileImage);

  const url = baseUrl + "/register";

  showLoader(true);
  axios
    .post(url, formData)
    .then((response) => {
      let token = response.data.token;
      let user = response.data.user;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const modal = document.getElementById("register-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      setupUI();

      let userInfo = JSON.parse(localStorage.getItem("user"));
      let name = userInfo["name"] ? userInfo["name"] : "";
      let message = `Welcome ${name}, you have registered your new account sccessfully!`;
      showStatusAlert(message, "success");
    })
    .catch((error) => {
      registerValidate(error);

      showStatusAlert(error.response.data.message, "danger");
    })
    .finally(() => {
      showLoader(false);
    });
}

function editBtnClicked(post) {
  post = JSON.parse(decodeURIComponent(post));

  document.getElementById("edit-post-id").value = post.id;
  document.getElementById("post-header-modal").innerHTML = "Edit Post";
  document.getElementById("post-title").value = post.title;
  document.getElementById("post-body").value = post.body;
  document.getElementById("post-modal-submit-btn").innerHTML = "Edit";

  let modal = new bootstrap.Modal(document.getElementById("new-post-modal"));
  modal.toggle();
}

function deleteBtnClicked(postId) {
  document.getElementById("delete-post-id-modal").value = postId;
  let modal = new bootstrap.Modal(document.getElementById("confirm-post-delete-modal"));
  modal.toggle();
}

function createNewPostClicked() {
  let postId = document.getElementById("edit-post-id").value;
  let isCreate = postId == null || postId == "";

  let url;
  const token = localStorage.getItem("token");
  const postTitle = document.getElementById("post-title").value;
  const postBody = document.getElementById("post-body").value;
  const postImage = document.getElementById("post-image").files[0];
  let user = getCurrentUser();

  let formData = new FormData();
  formData.append("body", postBody);
  formData.append("title", postTitle);
  postImage ? formData.append("image", postImage) : false;

  const config = {
    headers: { authorization: `Bearer ${token}` },
  };

  if (isCreate) {
    url = baseUrl + "/posts";

    showLoader(true);
    axios
      .post(url, formData, config)
      .then((response) => {
        const modal = document.getElementById("new-post-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        if (location.pathname === "/home.html") {
          document.getElementById("posts").innerHTML = "";
        }

        showStatusAlert("Your post has been created", "success");
        getPosts();
      })
      .catch((error) => {
        showStatusAlert(error.response.data.message, "danger");
        error = error.response.data.errors;
        validateNewPost(error);
      })
      .finally(() => {
        showLoader(false);
      });
  } else {
    url = baseUrl + `/posts/${postId}`;
    formData.append("_method", "put");

    showLoader(true);
    axios
      .post(url, formData, config)
      .then((response) => {
        const modal = document.getElementById("new-post-modal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();

        if (location.pathname === "/home.html") {
          document.getElementById("posts").innerHTML = "";
        } else if (location.pathname === "/postDetails.html") {
          window.location.reload();
        }

        showStatusAlert("Your post has been Edited", "success");
        getPosts();
      })
      .catch((error) => {
        validateNewPost(error);
        error = error.response.data.message;
        showStatusAlert(error, "danger");
      })
      .finally(() => {
        showLoader(false);
      });
  }
}

function confirmPassword() {
  const password = document.getElementById("password-register-input");
  const confirmPass = document.getElementById("confirm-password-input");
  const validatePass = document.getElementById("validationServer04Feedback");

  if (password.value !== confirmPass.value) {
    confirmPass.classList.toggle("is-invalid", true);
  } else {
    confirmPass.classList.toggle("is-invalid", false);
  }
}

function confirmPostDelete() {
  let postId = document.getElementById("delete-post-id-modal").value;
  let url = baseUrl + `/posts/${postId}`;
  let token = localStorage.getItem("token");
  const config = {
    headers: { authorization: `Bearer ${token}` },
  };

  showLoader(true);
  axios
    .delete(url, config)
    .then(() => {
      showLoader(false);

      if (location.pathname === "/home.html") {
        document.getElementById("posts").innerHTML = "";
        getPosts();
      } else if (location.pathname === "/postDetails.html") {
        window.location = "/home.html";
      }
      showStatusAlert("Your post has been deleted!", "primary");

      const modal = document.getElementById("confirm-post-delete-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
    })
    .finally(() => {
      getPosts();
    })
    .catch((error) => {
      console.error(error);
    });
}

function showStatusAlert(alertMessage, alertType) {
  let alertId = Math.floor(Math.random() * 1000);
  const wrapper = document.getElementById("status-alert");
  const alertElement = document.createElement("div");
  alertElement.className = `alert alert-${alertType} alert-dismissible movable-alert`;
  alertElement.id = `movable-alert-${alertId}`;
  alertElement.role = "alert";
  alertElement.style.right = "-600%";
  alertElement.innerHTML = [`<div>${alertMessage}</div>`, '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'].join("");

  wrapper.appendChild(alertElement);

  const alert = document.getElementById(`movable-alert-${alertId}`);

  // Wrap the animation logic in a closure and invoke it immediately
  (function animateAlert() {
    setTimeout(() => {
      alert.style.right = "10px";
      setTimeout(() => {
        alert.style.right = "600%";
        setTimeout(() => {
          alert.remove();
        }, 500); // increased delay to match transition duration
      }, 4000);
    }, 50);
  })(); // Invoke the function immediately
}

function moveAlert(alertId) {
  const alert = document.getElementById(`movable-alert-${alertId}`);

  setTimeout(() => {
    alert.style.right = "10px";
    setTimeout(() => {
      alert.style.right = "600%";
      setTimeout(() => {
        alert.remove();
      }, 1);
    }, 4000);
  }, 50);
}

function setupUI() {
  let token = localStorage.getItem("token");

  if (token !== null) {
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";

    let userInfo = JSON.parse(localStorage.getItem("user"));
    let name = userInfo.name;
    let image = userInfo.profile_image;

    let content = `
      <div class="user-info">
        <img src="${typeof image === "string" ? image : "https://cdn3.iconfinder.com/data/icons/basic-ui-element-s94-3/64/Basic_UI_Icon_Pack_-_Glyph_user-512.png"}" alt="">
        <span>${name}</span>
      </div>
      <button id="logout-btn" class="btn btn-outline-danger me-2" onclick="logout()" href="#">Logout</button>
    `;
    loggedUser.style.setProperty("display", "flex", "important");
    loggedUser.innerHTML = content;
    if (newPostBtn !== null) {
      newPostBtn.style.display = "block";
    }

    if (window.location.pathname === "/postDetails.html") {
      document.getElementById("add-comment-div").style.display = "flex";
    }
  } else {
    loginBtn.style.display = "block";
    registerBtn.style.display = "block";
    loggedUser.style.setProperty("display", "none", "important");
    if (newPostBtn !== null) {
      newPostBtn.style.display = "none";
    }

    if (window.location.pathname === "/postDetails.html") {
      document.getElementById("add-comment-div").style.display = "none";
    }
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setupUI();

  let message = `You have logged out sccessfully!`;
  showStatusAlert(message, "primary");
}

function registerValidate(error) {
  let resData = error.response.data.errors;
  let name = document.getElementById("nickname-input");
  let username = document.getElementById("username-register-input");
  let email = document.getElementById("email-input");
  let password = document.getElementById("password-register-input");
  let image = document.getElementById("profile-image");

  if ("name" in resData) {
    name.classList.add("is-invalid");
    name.nextElementSibling.innerHTML = resData.name[1];
  } else {
    name.classList.remove("is-invalid");
  }
  if ("email" in resData) {
    email.classList.add("is-invalid");
    email.nextElementSibling.innerHTML = resData.email[0];
  } else {
    email.classList.remove("is-invalid");
  }
  if ("username" in resData) {
    username.classList.add("is-invalid");
    username.nextElementSibling.innerHTML = resData.username[0];
  } else {
    username.classList.remove("is-invalid");
  }
  if ("password" in resData) {
    password.classList.add("is-invalid");
    password.nextElementSibling.innerHTML = resData.password[0];
  } else {
    password.classList.remove("is-invalid");
  }
  if ("image" in resData) {
    image.classList.add("is-invalid");
    image.nextElementSibling.innerHTML = resData.image[0];
  } else {
    image.classList.remove("is-invalid");
  }
}

function validateNewPost(errors = null) {
  const postBody = document.getElementById("post-body");
  const postImage = document.getElementById("post-image");
  if ("body" in errors) {
    postBody.classList.add("is-invalid");
    postBody.nextElementSibling.innerHTML = errors["body"];
  } else {
    postBody.classList.remove("is-invalid");
    postBody.nextElementSibling.innerHTML = "";
  }
  if ("image" in errors) {
    postImage.classList.add("is-invalid");
    postImage.nextElementSibling.innerHTML = errors["image"];
  } else {
    postImage.classList.remove("is-invalid");
    postImage.nextElementSibling.innerHTML = "";
  }
}

function validateLogin() {
  const errorDiv = document.querySelector(".error-div");
  const usernameInput = document.getElementById("username-input");
  const passwordInput = document.getElementById("password-input");

  errorDiv.innerHTML = "Wrong username or password.";
  usernameInput.classList.add("is-invalid");
  passwordInput.classList.add("is-invalid");
}

function redirectToPostDetails(postId) {
  window.location = `./postDetails.html?postId=${postId}`;
}

function addPostBtnClicked() {
  document.getElementById("edit-post-id").value = "";
  document.getElementById("post-header-modal").innerHTML = "Add A New Post";
  document.getElementById("post-title").value = "";
  document.getElementById("post-body").value = "";
  document.getElementById("post-modal-submit-btn").innerHTML = "Post";

  let modal = new bootstrap.Modal(document.getElementById("new-post-modal"));
  modal.toggle();
}

function userClicked(userId) {
  console.log(userId);
  window.location = `./profile.html?userId=${userId}`;
}

function profileClicked() {
  let user = getCurrentUser();
  if (user !== null) {
    window.location = `/profile.html?userId=${user.id}`;
  } else {
    showStatusAlert("You need to login first", "danger");
  }
}

function showLoader(show) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}

function postModalClosed() {
  document.getElementById("post-body").classList.remove("is-invalid");
}
