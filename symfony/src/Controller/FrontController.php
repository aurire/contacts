<?php
// src/Controller/LuckyController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FrontController extends AbstractController
{
    /**
    * @Route("/front/index")
    */
    public function index(): Response
    {
        $contents = $this->render('base.html.twig', []);

        return $contents;
    }
}
