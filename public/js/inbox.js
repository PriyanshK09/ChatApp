// for opening and closing the modal in mobile devices
const toggleSideBarButton = document.querySelector(".toggle_side_bar_button button");
const closeSideBarButton = document.querySelector(".closeSideBarButton button");
const messageArea = document.querySelector(".messages");
const sideBar = document.querySelector(".sideBar");

toggleSideBarButton.addEventListener("click", () => {
  sideBar.classList.add("active_side_bar");
  messageArea.style.overflowY = "hidden";
});

closeSideBarButton.addEventListener("click", () => {
  sideBar.classList.remove("active_side_bar");
  messageArea.style.overflowY = "unset";
});

// for opening and closing the modal after clicking no the start new chat button
const modalButton = document.querySelector(".addNewConversation");
const startNewChatModal = document.querySelector(".start_new_chat_modal_content_container");
const closeModalButton = document.querySelector(".close_modal_button");

function openModal() {
  startNewChatModal.style.display = "grid";
}
function closeModal() {
  startNewChatModal.style.display = "none";

  searchInput.value = "";
  searchResultContainer.style.display = "none";
}

modalButton.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);

// for doing the search operation from the start new conversation modal
const searchInput = document.querySelector(".start_new_chat_modal .search_field input");
const searchResultContainer = document.querySelector(".start_new_chat_modal .search_results");

let typingTimer;
const doneTypingInterval = 500;

searchInput.addEventListener("keyup", () => {
  clearTimeout(typingTimer);
  searchResultContainer.style.display = "none";

  if (searchInput.value) {
    typingTimer = setTimeout(searchUsers, doneTypingInterval);
  }
});

searchInput.addEventListener("keydown", () => {
  clearTimeout(typingTimer);
  while (searchResultContainer.firstChild) {
    searchResultContainer.removeChild(searchResultContainer.lastChild);
  }
});

// for searching users when typing on the search bar
async function searchUsers() {
  try {
    const errorPlaceholder = document.querySelector(".search_error");
    errorPlaceholder.textContent = "";
    errorPlaceholder.style.display = "none";

    const res = await fetch("/users/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queryText: searchInput.value }),
    });
    const { errors, results } = await res.json();

    if (errors) {
      errorPlaceholder.textContent = errors.common.msg;
      errorPlaceholder.style.display = "block";
    } else {
      if (results.length > 0) {
        results.map((result) => {
          const avatar = result.avatar ? "./uploads/avatars/" + result.avatar : "./assets/nophoto.png";
          const resultHtml = `
          <div onclick="createConversation('${result._id}', '${result.name}', '${result.avatar}')" class="result">
            <div class="userImg">
              <img src="${avatar}" alt="${result.name}" />
            </div>
            <p class="user_name">${result.name}</p>
          </div>
          `;

          searchResultContainer.insertAdjacentHTML("afterbegin", resultHtml);
          searchResultContainer.style.display = "block";
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
}

// for creating a new conversation after clicking on a search result
async function createConversation(userId, username, userAvatar) {
  try {
    const res = await fetch("/inbox/createConversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participant: username,
        id: userId,
        avatar: userAvatar != "undefined" ? userAvatar : null,
      }),
    });
    const body = await res.json();

    if (!body.errors) {
      if (res.ok) {
        searchResultContainer.style.display = "none";
        searchInput.value = username;
        setTimeout(() => {
          closeModal();
          setTimeout(() => {
            closeModal();
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }, 500);
        }, 500);
      }
    } else {
      throw new Error(body.errors.common.msg);
    }
  } catch (err) {
    console.log(err);
  }
}

// for closing the attachment preview
function closePreview(src) {
  const img = document.querySelector(`img[src='${src}']`);
  const previewContainer = img.parentElement;
  document.body.removeChild(previewContainer);
}

// for showing up a full preview of attachments
function showFullImg(src) {
  const previewHTML = `
  <div class="preview_container">
    <img src="${src}" alt="${src}" />
    <div class="close">
      <button onclick="closePreview('${src}')">Close</button>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML("afterbegin", previewHTML);
}
