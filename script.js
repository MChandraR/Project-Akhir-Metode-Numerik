let logic = "*-−+/^%";

function sanitize(formula){
    formula = formula.replace(" ", "");
    while(formula.includes("^"))formula = formula.replace("^", "**");
    let new_formula = formula[0];
    for(let i=1;i<formula.length;i++){
        let pass = false;
        ["*","-","+","/","^","%"].forEach((e)=>{
            if(formula[i].includes(e) || formula[i-1].includes(e)) pass = true;
        });
        if(Number.isInteger(parseInt(formula[i-1])) && Number.isNaN(parseInt(formula[i])) && !pass){
            console.log("haaa itu de");
            new_formula += "*";
        }
        new_formula += formula[i];
    }
    console.log(new_formula);
    return new_formula;
}

console.log(sanitize("2x"));
let curNum = 0;
let iterasiCol = document.getElementById("iterasi-col");
iterasiCol.innerHTML = window.width > 1000 ? "Iterasi" : "i";
let table = document.getElementById("hasil-area");
let container = document.getElementsByTagName("html")[0];
let len = window.screen.width > 1000 ? 6 : 3; 

document.getElementById('nr-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    curNum++;
    let cur = curNum;
    const funcInput = sanitize(document.getElementById('function').value);
    const derivInput = sanitize(document.getElementById('derivative').value);
    const initial = parseFloat(document.getElementById('initial').value);
    const tolerance = parseFloat(document.getElementById('tolerance').value);
    const maxIterations = parseInt(document.getElementById('max-iterations').value);

    const f = new Function('x', `return ${funcInput};`);
    const fPrime = new Function('x', `return ${derivInput};`);

    let x = initial;
    let error = Infinity;
    let iteration = 0;
    const resultsTable = document.getElementById('results-table').querySelector('tbody');
    resultsTable.innerHTML = '';
    
    try{       
        while (error > tolerance && iteration < maxIterations ) {
            const fx = f(x);
            const fpx = fPrime(x);
    
            if (fpx === 0) {
                alert('Turunan bernilai 0 tidak bisa melanjutkan iterasi');
                return;
            }
    
            const xNext = x - (fx / fpx);
            error = Math.abs(xNext - x);
            
    
            const row = `<tr>
                <td class="iterasi-col">${iteration + 1}</td>
                <td>${x.toFixed(len)}</td>
                <td>${fx.toFixed(len)}</td>
                <td>${fpx.toFixed(len)}</td>
                <td>${error.toFixed(len)}</td>
                <td>
                    <button class="lihat" onClick="showDetail(${iteration + 1},${x.toFixed(6)},'${funcInput}', '${derivInput}', '${fx}', '${fpx}', '${xNext}', '${error}')">Lihat</button>
                </td>
            </tr>`;

            resultsTable.insertAdjacentHTML('beforeend', row);
            table.scrollBy({ 
                top: table.offsetHeight,
                behavior: 'smooth' 
              });

            container.scrollBy({
                top : container.offsetHeight,
                behavior : 'smooth'
            });
    
            x = xNext;
            iteration++;
            await new Promise(r => setTimeout(r, 200));
        }

        if (error <= tolerance) {
            Swal.fire({
                title : "Proses Selesai",
                icon : "info",
                text : `Solusi konvergen terhadap x = ${x.toFixed(6)} dalam ${iteration} iterasi.`
            });
        } else {
            Swal.fire({
                title : "Proses Selesai",
                icon : "error",
                text : 'Solusi tidak/belum konvergen sesuai dengan iterasi maksimum'
            });
        }
    }catch(e){
        console.log(e);
        Swal.fire({
            title : "Input tidak valid",
            icon : "error",
            text : `Harap isi semua field !`
        });
    }
    curNum--;
    
});


let anggotaArea = document.getElementById("anggota-area");
let coolDown = false;


function showAnggota(){
    if(!coolDown){
        coolDown = true;
        setTimeout(()=>{
            coolDown = false;
        },1500);
        anggotaArea.classList.add("show");
        anggotaArea.classList.toggle("hide");
    }
}

let proses = document.getElementById("proses-area");
let error = document.getElementById("error");
let iterasi = document.getElementById("iterasi");
let func = document.getElementById("f-content");
let next = document.getElementById("next");
let nextProc = document.getElementById("nextProcess");
let fa = document.getElementById("fa-content");
let nilaiX = document.getElementById("nilai-x");

function showDetail(i,x, f, df,fx, fpx, xNext, err){
    proses.classList.remove("hide");
    nilaiX.innerHTML = `Nilai X${i-1} = ${x}`;
    next.innerHTML = `Mencari nilai X${i-1} + 1`;
    nextProc.innerHTML = `
    <span> = </span> 
    <span> X${i-1} -  ( f(x<sub>X${i-1}</sub>) / f'(x<sub>X${i-1}</sub>) ) </span> 
    <span> = </span>
    <span> ${x} - ( ${fx}/${fpx} ) </span> 
    <span> = </span>
    <span> ${xNext} </span>
    `;
    const funcInput = sanitize(document.getElementById('function').value);
    iterasi.innerHTML = i;
    func.innerHTML = `
        f(${x}) = ${f.replace("x", x)} <br>
        f(${x}) = ${fx}
    `;

    fa.innerHTML = `
        f'(${x}) = ${df.replace("x", x)} <br>
        f'(${x}) = ${fpx}
    `;

    error.innerHTML = `Nilai Error : ${err}`;
}


function closeDetail(){
    proses.classList.add("hide");
}