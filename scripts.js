function addStudent() {
    let name = document.getElementById("name").value.trim();
    let nrp = document.getElementById("nrp").value.trim();
    let photoInput = document.getElementById("photo");
    let jurusan = document.getElementById("jurusan").value.trim();

    // Validasi: Nama & NRP tidak boleh kosong
    if (!name && !nrp && !jurusan) {
        alert("Nama, NRP, dan Jurusan tidak boleh kosong!");
        return;
    } else if (!name) {
        alert("Nama tidak boleh kosong!");
        return;
    } else if (!nrp) {
        alert("NRP tidak boleh kosong!");
        return;
    } else if (!jurusan){
        alert("Jurusan tidak boleh kosong!")
        return;
    }

    // Validasi: Nama hanya boleh berisi huruf dan spasi
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        alert("Nama hanya boleh berisi huruf!");
        return;
    }

    // Validasi: NRP harus 1 huruf di awal dan 8 angka setelahnya
    if (!/^[A-Za-z]\d{8}$/.test(nrp)) {
        alert("NRP harus diawali dengan 1 huruf dan diikuti oleh 8 angka!");
        return;
    }
    
    // Ubah huruf pertama jadi kapital otomatis
    nrp = nrp.charAt(0).toUpperCase() + nrp.slice(1);    

    // Proper Case untuk nama dan jurusan
    name = name.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    jurusan = jurusan.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());

    // Validasi: Nama dan NRP harus unik
    let existingNames = document.querySelectorAll('.ktm-card h3');
    let existingNRPs = document.querySelectorAll('.ktm-card p');
    
    for (let existingName of existingNames) {
        if (existingName.innerText === name) {
            alert("Nama sudah terdaftar! Gunakan nama lain.");
            return;
        }
    }

    for (let existingNRP of existingNRPs) {
        if (existingNRP.innerText === nrp) {
            alert("NRP sudah terdaftar! Gunakan NRP lain.");
            return;
        }
    }

    // Validasi: Foto harus diunggah dan dalam format JPG/JPEG/PNG
    if (!photoInput.files.length) {
        alert("Harap pilih foto!");
        return;
    }
    let file = photoInput.files[0];
    let fileType = file.type;
    if (fileType !== "image/jpeg" && fileType !== "image/jpg" && fileType !== "image/png") {
        alert("Foto harus dalam format JPG, PNG, atau JPEG!");
        return;
    }

    // Baca file gambar dan buat kartu KTM
    let reader = new FileReader();
    reader.onload = function (event) {
        let photoURL = event.target.result;
        let ktmContainer = document.getElementById("ktmContainer");

        let ktmWrapper = document.createElement("div");
        ktmWrapper.className = "ktm-wrapper";
        ktmWrapper.style.marginBottom = "15px";
        ktmWrapper.setAttribute('data-card-id', Date.now());

        let optionsDiv = document.createElement("div");
        optionsDiv.className = "ktm-options";
        optionsDiv.innerHTML = `
            <button onclick="editStudent(this)">✏️ Edit</button>
            <button onclick="deleteStudent(this)">🗑️ Hapus</button>
        `;

        let ktmCard = document.createElement("div");
        ktmCard.className = "ktm-card";
        ktmCard.innerHTML = `
            <img src="${photoURL}" alt="Foto Mahasiswa" class="ktm-photo">
            <h3>${name}</h3>
            <p>${nrp}</p>
            <p class="ktm-major"> ${jurusan}</p>
            <svg id="barcode-${nrp}" class="barcode"></svg>
            <div class="ktm-footer">Petra Christian University</div>
        `;

        ktmWrapper.appendChild(optionsDiv);
        ktmWrapper.appendChild(ktmCard);
        ktmContainer.appendChild(ktmWrapper);

        setTimeout(() => {
            JsBarcode(`#barcode-${nrp}`, nrp, { 
                format: "CODE128", 
                displayValue: true, 
                lineColor: "black", 
                width: 2, 
                height: 40 
            });
        }, 100);

        document.getElementById("name").value = "";
        document.getElementById("nrp").value = "";
        document.getElementById("jurusan").value = "";
        document.getElementById("photo").value = "";
    };

    reader.readAsDataURL(photoInput.files[0]);
}

function editStudent(button) {
    let cardWrapper = button.closest('.ktm-wrapper');
    
    let card = cardWrapper.querySelector('.ktm-card');
    let nameElement = card.querySelector('h3');
    let nrpElement = card.querySelector('p');
    let jurusanElement = card.querySelector('.ktm-major');
    let jurusanText = jurusanElement ? jurusanElement.innerText.replace("Jurusan: ", "") : '';

    document.getElementById('editContainer').style.display = 'block';

    document.getElementById('editName').value = nameElement.innerText;
    document.getElementById('editNrp').value = nrpElement.innerText;
    document.getElementById('editJurusan').value = jurusanText;
    document.getElementById('editContainer').setAttribute('data-editing-card', cardWrapper.dataset.cardId);

    document.getElementById('editContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function saveEdit() {
    let cardId = document.getElementById('editContainer').getAttribute('data-editing-card');
    let cardWrapper = document.querySelector(`[data-card-id='${cardId}']`);
    
    if (!cardWrapper) return;

    let card = cardWrapper.querySelector('.ktm-card');

    let nameElement = card.querySelector('h3');
    let nrpElement = card.querySelector('p');
    let jurusanElement = card.querySelector('.ktm-major');
    let photoElement = card.querySelector('.ktm-photo');
    let barcodeElement = card.querySelector('svg');

    let newName = document.getElementById('editName').value.trim();
    let newNrp = document.getElementById('editNrp').value.trim();
    let newJurusan = document.getElementById('editJurusan').value.trim();
    let newPhoto = document.getElementById('editPhoto').files[0];

    // Validasi: Nama, NRP, dan Jurusan tidak boleh kosong
    if (!newName || !newNrp || !newJurusan) {
        alert("Nama, NRP, dan Jurusan tidak boleh kosong!");
        return;
    }

    // Validasi: Nama hanya boleh berisi huruf dan spasi
    if (!/^[a-zA-Z\s]+$/.test(newName)) {
        alert("Nama hanya boleh berisi huruf!");
        return;
    }

    // Validasi: NRP harus 1 huruf di awal dan 8 angka setelahnya
    if (!/^[A-Za-z]\d{8}$/.test(newNrp)) {
        alert("NRP harus diawali dengan 1 huruf dan diikuti oleh 8 angka!");
        return;
    }

    // Ubah format NRP, nama, dan jurusan
    newNrp = newNrp.charAt(0).toUpperCase() + newNrp.slice(1);
    newName = newName.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
    newJurusan = newJurusan.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());

    // Validasi: Nama harus unik (kecuali jika itu adalah nama yang sama dengan data yang sedang di-edit)
    let existingNames = document.querySelectorAll('.ktm-card h3');
    for (let existingName of existingNames) {
        // Skip jika nama yang sama adalah nama dari data yang sedang di-edit
        if (existingName === nameElement) continue;

        if (existingName.innerText === newName) {
            alert("Nama sudah terdaftar! Gunakan nama lain.");
            return;
        }
    }

    // Validasi: NRP harus unik (kecuali jika itu adalah NRP yang sama dengan data yang sedang di-edit)
    let existingNRPs = document.querySelectorAll('.ktm-card p');
    for (let existingNRP of existingNRPs) {
        // Skip jika NRP yang sama adalah NRP dari data yang sedang di-edit
        if (existingNRP === nrpElement) continue;

        if (existingNRP.innerText === newNrp) {
            alert("NRP sudah terdaftar! Gunakan NRP lain.");
            return;
        }
    }

    // Update data
    if (nameElement) nameElement.innerText = newName;
    if (nrpElement) nrpElement.innerText = newNrp;
    if (jurusanElement) jurusanElement.innerHTML = `${newJurusan}`;

    // Update foto jika ada
    if (newPhoto && photoElement) {
        let reader = new FileReader();
        reader.onload = function(e) {
            photoElement.src = e.target.result;
        };
        reader.readAsDataURL(newPhoto);
    }

    // Update barcode jika NRP berubah
    if (barcodeElement && newNrp) {
        JsBarcode(barcodeElement, newNrp, { 
            format: "CODE128", 
            displayValue: true, 
            background: "white", 
            lineColor: "black", 
            width: 2, 
            height: 40 
        });
    }

    // Sembunyikan form edit
    document.getElementById('editContainer').style.display = 'none';
}

function deleteStudent(button) {
    let cardWrapper = button.closest('.ktm-wrapper');
    if (confirm("Apakah Anda yakin ingin menghapus KTM ini?")) {
        cardWrapper.remove();
    }
}

function cancelEdit() {
    document.getElementById('editContainer').style.display = 'none';
}

function scrollToForm() {
    document.getElementById("formSection").scrollIntoView({ behavior: "smooth" });
}

function previewPhoto() {
    const photoInput = document.getElementById('photo');
    const photoPreviewContainer = document.getElementById('photoPreviewContainer');
    const photoPreview = document.getElementById('photoPreview');

    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
            photoPreview.src = event.target.result;
            photoPreviewContainer.style.display = 'block';
        };
        reader.readAsDataURL(photoInput.files[0]);
    }
}

function parallaxEffect() {
    let scrollPos = window.scrollY;

    // Efek parallax untuk teks
    document.querySelectorAll('.parallax-text').forEach((el) => {
        el.style.transform = `translateY(${scrollPos * 0.3}px)`;
    });

    // Efek parallax untuk background
    document.querySelector('.parallax-container').style.backgroundPosition = `center ${scrollPos * 0.5}px`;

    // Efek parallax untuk meteor
    document.querySelectorAll('.parallax-meteor').forEach((el) => {
        el.style.transform = `translate(-50%, calc(-50% + ${scrollPos * 0.2}px))`;
    });

    // Efek parallax untuk stars di page 2 dan seterusnya
    let stars = document.querySelector('.stars-parallax');
    if (stars) {
        stars.style.transform = `translateY(${scrollPos * 0.1}px)`; // Kecepatan paralaks bisa disesuaikan
    }
}

function debounce(func, wait = 10) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

window.addEventListener('scroll', debounce(() => {
    requestAnimationFrame(parallaxEffect);
}));