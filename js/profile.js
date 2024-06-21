let urlParams = new URLSearchParams(window.location.search);
let userId = urlParams.get("userId");

setupUI();
showProfileInfo();
getPosts(userId);

function showProfileInfo() {
  let url = baseUrl + `/users/${userId}`;

  showLoader(true);
  axios
    .get(url)
    .then((response) => {
      const user = response.data.data;

      document.getElementById("profile-image-info").src = user.profile_image;
      document.getElementById("profile-email-info").innerHTML = user.email;
      document.getElementById("profile-username-info").innerHTML = user.username;
      document.getElementById("profile-name-info").innerHTML = user.name;
      document.getElementById("profile-posts-count").innerHTML = user.posts_count;
      document.getElementById("profile-comments-count").innerHTML = user.comments_count;
    })
    .finally(() => {
      showLoader(false);
    });
}

function getPosts(id = null) {
  if (id === null) {
    id = userId;
  }
  let url = baseUrl + `/users/${id}/posts`;

  showLoader(true);
  axios
    .get(url)
    .then((response) => {
      let posts = response.data.data;
      document.getElementById("posts").innerHTML = "";

      for (let i = posts.length - 1; i >= 0; i--) {
        makePost(posts[i]);
      }

      showProfileInfo();
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      showLoader(false);
    });
}
