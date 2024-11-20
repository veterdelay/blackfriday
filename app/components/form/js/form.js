import axios from 'axios';
import Inputmask from "inputmask";
import { onResize } from "../../../js/main.js";

const form = document.querySelector('form');

function send(){
    event.preventDefault();

    let name = document.getElementById('name').value;
    let lastName = document.getElementById('lastname').value;
    let phone = document.getElementById('phone').value.replace(/[^\d]/g, '');
    let email = document.getElementById('mail').value;
    let org = document.getElementById('organization').value;
    let body = document.getElementById('txt').value;

    if (getValid()) {

        axios({
        method: 'post',
        url: 'https://api.gelius.ua/api/v1/feedbacks/create/?lang=uk',
        data: {
            first_name: name,
            last_name: lastName,
            email: email,
            phone: phone,
            body: body,
            org_name: org,
            form: 1,
            theme :1
        }
        }).then(function (response) {
            form.reset();
            document.querySelector('.input-send').classList.add('send');
        })
        .catch(function (error) {
            form.reset();
            console.log(error);
        });


    }
}

form.addEventListener("submit", send);

Inputmask({"mask": "38 (999) 999-99-99"}).mask('.phone');

function checkSymbolsLength(){
    const area = document.querySelector('textarea');
    const valueHtml = document.querySelector('.textarea_symbols_actual');

    valueHtml.innerHTML = area.value.length;
}

document.querySelector('textarea').addEventListener("input", checkSymbolsLength);

function getValid(){
    let res = true;
    document.querySelector('.input-error').classList.remove('error');
    document.querySelector('.input-error-phone').classList.remove('error');
    document.querySelector('.input-error-mail').classList.remove('error');
    document.querySelector('.input-send').classList.remove('send');
    Array.prototype.forEach.call(document.querySelectorAll('.required'), el => {
      if (!el.value) {
        el.classList.add('error')
        document.querySelector('.input-error').classList.add('error');
        res = false;
      }else if(el.classList.contains('phone') && (el.value.replace(/[^\d]/g, '').length < 12 || String(el.value.replace(/[^\d]/g, '')).slice(0,3) !== '380')){
        el.classList.add('error')
        document.querySelector('.input-error-phone').classList.add('error');
        res = false;
      }else if (el.classList.contains('mail') && !validateEmail(el.value)){
        el.classList.add('error')
        document.querySelector('.input-error-mail').classList.add('error');
        res = false;  
      }else{
        el.classList.remove('error')
      }
      onResize();
    })
    return res;
}

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};