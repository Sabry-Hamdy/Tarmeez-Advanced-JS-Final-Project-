let pageNumber = 1;

getPosts(pageNumber);
setupUI();

window.addEventListener("scroll", function () {
  if (Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight) {
    getPosts(++pageNumber);
  }
});

// function makePost(post) {
//   let username = post.author.username;
//   let profilePic =
//     typeof post.author.profile_image === "string" ? post.author.profile_image : "https://cdn3.iconfinder.com/data/icons/basic-ui-element-s94-3/64/Basic_UI_Icon_Pack_-_Glyph_user-512.png";
//   let imageUrl = post.image;
//   let createdAt = post["created_at"];
//   let title = typeof post.title === "string" ? post.title : "";
//   let body = post.body;
//   let id = post.id;
//   let tagsObj = post.tags;

//   let user = getCurrentUser();
//   let isMyPost = user != null && post.author.id === user.id;
//   let editBtn = ``;
//   let deleteBtn = ``;

//   if (isMyPost) {
//     editBtn = `<button class="btn btn-secondary mt-2 me-2" style="float: right" onclick="editBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>`;
//     deleteBtn = `<button class="btn btn-danger mt-2 me-2" style="float: right" onclick="deleteBtnClicked(${id})">Delete</button>`;
//   }

//   let commentsCount = post["comments_count"] === 0 ? "No comments yet" : `${post["comments_count"]} Comments`;

//   document.getElementById("posts").innerHTML += `
// 	<!-- POST -->
//           <div class="card shadow-sm mb-3" style="position: relative">
//             <div class="card-header">
//               <img src="${profilePic}" alt="" class="rounded-circle me-2 border border-3" />
//               <span>@${username}</span>

//               ${editBtn}
//               ${deleteBtn}

//             </div>
//             <div class="card-body" style="cursor: pointer" id="post-body"  onclick="redirectToPostDetails(${id})">
//               <img class="w-100" src="${imageUrl}" alt="" />
//               <span class="d-block post-time fw-medium">${createdAt}</span>
//               <h5 class="card-title mt-3">${title}</h5>
// 							<p>${body}</p>
//               <hr />
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
//                 <path
//                   d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"
//                 />
//               </svg>
//               <span>${commentsCount}</span>
//               <span id="tags-${id}">

//               </span>
//             </div>
//           </div>
//           <!--// POST //-->
// 	`;

//   let tagsParent = document.getElementById(`tags-${id}`);
//   for (let tag of tagsObj) {
//     tagsParent.innerHTML += `
//       <span class="bg-secondary px-3 py-1  ms-1 rounded-pill text-white">${tag.name}</span>
//     `;
//   }
// }

// function getCurrentUser() {
//   let user = null;
//   const storageUser = localStorage.getItem("user");

//   if (storageUser !== null) {
//     user = JSON.parse(storageUser);
//   }

//   return user;
// }
