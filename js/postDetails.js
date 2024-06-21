showExactPost();

function showExactPost() {
  let urlParams = new URLSearchParams(window.location.search);
  let postId = urlParams.get("postId");

  let url = baseUrl + "/posts/" + postId;
  const postContainer = document.getElementById("post-container");

  showLoader(true);
  axios
    .get(url)
    .then((response) => {
      response = response.data.data;
      const username = response.author.username;
      const profilePic =
        typeof response.author.profile_image === "string" ? response.author.profile_image : "https://cdn3.iconfinder.com/data/icons/basic-ui-element-s94-3/64/Basic_UI_Icon_Pack_-_Glyph_user-512.png";
      const postImage = response.image;
      const createdAt = response.created_at;
      const title = response.title !== null ? response.title : "";
      const body = response.body;
      const commentsCount = response.comments_count > 0 ? `${response.comments_count} Comments` : "No comments yet";
      const tags = response.tags;
      const comments = response.comments;
      let user = getCurrentUser();
      let isMyPost = user != null && response.author.id === user.id;
      let editBtn = ``;
      let deleteBtn = ``;

      if (isMyPost) {
        editBtn = `<button class="control-post btn btn-secondary mt-2 me-2" style="float: right" onclick="editBtnClicked('${encodeURIComponent(JSON.stringify(response))}')">Edit</button>`;
        deleteBtn = `<button class="control-post btn btn-danger mt-2 me-2" style="float: right" onclick="deleteBtnClicked(${postId})">Delete</button>`;
      }

      let content = `
  <h1 class="mx-auto mb-5">${username}'s Post</h1>
      <div class="mx-auto card shadow-sm mb-3" style="position: relative">
        <div class="card-header">

          <div onclick="userClicked(${response.author.id})" style="cursor: pointer; display: inline-block">
            <img src="${profilePic}" alt="" class="rounded-circle me-2 border border-3" />
            <span>@${username}</span>
          </div>

          ${editBtn}
          ${deleteBtn}
          
        </div>
        <div class="card-body" id="">
          <img class="w-100" src="${postImage}" alt="" />
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
          <span id="tags-${postId}"> </span>
        </div>
        <ul class="list-group comments-section" id="comments-section">
          
        </ul>
        <div class="input-group" id="add-comment-div">
          <input type="text" class="form-control comment-field" id="comment-input" placeholder="Comment on this post" aria-label="Text input with segmented dropdown button" />
          <button type="button" class="btn btn-primary submit-comment py-2" onclick="commentBtnClicked()">Comment</button>
        </div>
      </div>
  `;

      postContainer.innerHTML = content;
      let tagsParent = document.getElementById(`tags-${postId}`);
      for (let tag of tags) {
        tagsParent.innerHTML += `
      <span class="bg-secondary px-3 py-1  ms-1 rounded-pill text-white">${tag.name}</span>
    `;
      }

      for (let comment of comments) {
        document.getElementById("comments-section").innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-start py-3 comment">
        <img class="prof-pic" src="${comment.author.profile_image}" alt="" />
        <div class="ms-2 me-auto">
          <div class="fw-bold">${comment.author.username}</div>
            ${comment.body}
        </div>
      </li>
      `;
      }

      setupUI();
    })
    .finally(() => {
      showLoader(false);
    });
}

function commentBtnClicked() {
  let urlParams = new URLSearchParams(window.location.search);
  let postId = urlParams.get("postId");

  let url = baseUrl + `/posts/${postId}/comments`;
  let token = localStorage.getItem("token");
  let body = document.getElementById("comment-input");
  let bodyParams = {
    body: body.value,
  };
  let config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  axios.post(url, bodyParams, config).then((response) => {
    showExactPost();
    body.value = "";
  });
}
