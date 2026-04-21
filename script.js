let dataHelm = JSON.parse(localStorage.getItem("dataHelm")) || [];

const form = document.getElementById("formTransaksi");
const tableBody = document.querySelector("tbody");

const namaInput = document.getElementById("nama");
const jumlahInput = document.getElementById("jumlah");

let layananDipilih = "";
let currentEditIndex = -1;
let deleteIndex = -1;

const hargaList = {
    "Cuci Biasa": 10000,
    "Cuci + Kaca": 15000,
    "Deep Clean": 20000,
    "Poles Helm": 25000
};

/* PILIH */
function pilihLayanan(layanan) {
    layananDipilih = layanan;
    document.getElementById("layananTerpilih").innerText = "Layanan: " + layanan;
}

/* RENDER */
function renderData() {
    tableBody.innerHTML = "";

    dataHelm.forEach((item, index) => {
        let total = item.jumlah * hargaList[item.layanan];

        tableBody.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${item.nama}</td>
            <td>${item.layanan}</td>
            <td>${item.jumlah}</td>
            <td>Rp${total}</td>
            <td>${item.status}</td>
            <td>
                <button onclick="editData(${index})">Edit</button>
                <button onclick="hapusData(${index})">Hapus</button>
            </td>
        </tr>`;
    });

    updateStat();
}

/* SUBMIT */
form.addEventListener("submit", function(e) {
    e.preventDefault();

    if (!namaInput.value || !jumlahInput.value || !layananDipilih) {
        alert("Isi semua!");
        return;
    }

    dataHelm.push({
        nama: namaInput.value,
        jumlah: parseInt(jumlahInput.value),
        layanan: layananDipilih,
        status: "Proses"
    });

    localStorage.setItem("dataHelm", JSON.stringify(dataHelm));

    form.reset();
    layananDipilih = "";
    document.getElementById("layananTerpilih").innerText = "Layanan: -";

    renderData();
});

/* EDIT */
function editData(index) {
    let data = dataHelm[index];

    document.getElementById("editNama").value = data.nama;
    document.getElementById("editJumlah").value = data.jumlah;
    document.getElementById("editStatus").value = data.status;

    currentEditIndex = index;
    document.getElementById("modalEdit").style.display = "flex";
}

/* SIMPAN EDIT */
function simpanEdit() {
    if (currentEditIndex === -1) return;

    dataHelm[currentEditIndex].nama = document.getElementById("editNama").value;
    dataHelm[currentEditIndex].jumlah = parseInt(document.getElementById("editJumlah").value);
    dataHelm[currentEditIndex].status = document.getElementById("editStatus").value;

    localStorage.setItem("dataHelm", JSON.stringify(dataHelm));

    tutupModal();
    renderData();
}

/* TUTUP */
function tutupModal() {
    document.getElementById("modalEdit").style.display = "none";
    currentEditIndex = -1;
}

/* HAPUS */
function hapusData(index) {
    deleteIndex = index;
    document.getElementById("modalHapus").style.display = "flex";
}

function confirmHapus() {
    if (deleteIndex === -1) return;

    dataHelm.splice(deleteIndex, 1);
    localStorage.setItem("dataHelm", JSON.stringify(dataHelm));

    tutupModalHapus();
    renderData();
}

function tutupModalHapus() {
    document.getElementById("modalHapus").style.display = "none";
    deleteIndex = -1;
}

/* SEARCH */
function searchData(k) {
    document.querySelectorAll("tbody tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(k.toLowerCase()) ? "" : "none";
    });
}

/* FILTER */
function filterLayanan(layanan) {
    document.querySelectorAll("tbody tr").forEach(row => {
        let text = row.children[2].textContent.trim();
        row.style.display = (layanan === "Semua" || text === layanan) ? "" : "none";
    });
}

/* SIDEBAR FILTER */
const checkboxes = document.querySelectorAll("aside input[type='checkbox']");
checkboxes.forEach(cb => cb.addEventListener("change", filterSidebar));

function filterSidebar() {
    let selected = [];

    checkboxes.forEach(cb => {
        if (cb.checked) {
            selected.push(cb.parentElement.textContent.trim());
        }
    });

    document.querySelectorAll("tbody tr").forEach(row => {
        let layanan = row.children[2].textContent.trim();

        row.style.display =
            selected.length === 0 || selected.includes(layanan) ? "" : "none";
    });
}

/* STAT */
function updateStat() {
    let totalHelm = 0;
    let totalPendapatan = 0;

    dataHelm.forEach(d => {
        totalHelm += d.jumlah;
        totalPendapatan += d.jumlah * hargaList[d.layanan];
    });

    document.getElementById("statHelm").innerText = totalHelm;
    document.getElementById("statTransaksi").innerText = dataHelm.length;
    document.getElementById("statPendapatan").innerText = "Rp" + totalPendapatan;
}

/* LOAD */
renderData();