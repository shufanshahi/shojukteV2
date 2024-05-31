let blogId = decodeURI(location.pathname.split("/").pop());

let docRef = db.collection("blogs").doc(blogId);

docRef.get().then((doc) => {
    if(doc.exists){
        setupBlog(doc.data());
    } else{
        location.replace("/");
    }
})

const setupBlog = (data) => {
    const banner = document.querySelector('.banner');
    const blogTitle = document.querySelector('.title');
    const titleTag = document.querySelector('title');
    const publish = document.querySelector('.published');
    const commentSection = document.querySelector('.comment-section');
    
    banner.style.backgroundImage = `url(${data.bannerImage})`;

    titleTag.innerHTML += blogTitle.innerHTML = data.title;
    publish.innerHTML += data.publishedAt;

    const article = document.querySelector('.article');
    addArticle(article, data.article);

    if (data.comments) {
        data.comments.forEach(comment => {
            const p = document.createElement('p');
            p.textContent = comment;
            commentSection.appendChild(p);
        });
    }
    
}

const addArticle = (ele, data) => {
    data = data.split("\n").filter(item => item.length);
    // console.log(data);

    data.forEach(item => {
        // check for heading
        if(item[0] == '#'){
            let hCount = 0;
            let i = 0;
            while(item[i] == '#'){
                hCount++;
                i++;
            }
            let tag = `h${hCount}`;
            ele.innerHTML += `<${tag}>${item.slice(hCount, item.length)}</${tag}>`
        } 
        //checking for image format
        else if(item[0] == "!" && item[1] == "["){
            let seperator;

            for(let i = 0; i <= item.length; i++){
                if(item[i] == "]" && item[i + 1] == "(" && item[item.length - 1] == ")"){
                    seperator = i;
                }
            }

            let alt = item.slice(2, seperator);
            let src = item.slice(seperator + 2, item.length - 1);
            ele.innerHTML += `
            <img src="${src}" alt="${alt}" class="article-image">
            `;
        }

        else{
            ele.innerHTML += `<p>${item}</p>`;
        }
    })
}

const commentBtn = document.querySelector('.publish-btn');
    const commentInput = document.querySelector('.comment');

    commentBtn.addEventListener('click', () => {
        const newComment = commentInput.value.trim();
        if (newComment) {
            addComment(newComment);
        }
    });

    const addComment = (newComment) => {
        let docRef = db.collection("blogs").doc(blogId);

        docRef.get().then((doc) => {
            if (doc.exists) {
                let data = doc.data();
                let comments = data.comments || [];
                comments.push(newComment);

                docRef.update({
                    comments: comments
                }).then(() => {
                    const commentSection = document.querySelector('.comment-section');
                    const p = document.createElement('p');
                    p.textContent = newComment;
                    commentSection.appendChild(p);
                    commentInput.value = ''; // Clear the input field
                }).catch((err) => {
                    console.error('Error updating document:', err);
                });
            } else {
                console.error('Document does not exist!');
            }
        }).catch((err) => {
            console.error('Error getting document:', err);
        });
    };