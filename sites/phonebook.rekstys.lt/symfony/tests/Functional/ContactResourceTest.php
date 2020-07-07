<?php


namespace App\Tests\Functional;

use App\Entity\Contact;
use App\Entity\User;
use App\Test\CustomApiTestCase;
use Doctrine\ORM\EntityManagerInterface;
use Hautelook\AliceBundle\PhpUnit\ReloadDatabaseTrait;

class ContactResourceTest extends CustomApiTestCase
{
    use ReloadDatabaseTrait;

    public function testCreateContact()
    {
        $client = self::createClient();

        $client->request(
            'POST',
            '/api/contacts',
            ['json' => []]
        );

        $this->assertResponseStatusCodeSame(400);

        $this->createUserAndLogin($client, 'tester@testit.com', 'foo');
    }

    public function testUpdateContact()
    {
        //just to initialize
        $client = self::createClient();
        $user1 = $this->createUser('user1@example.com', 'belekas');

        $contact = new Contact();
        $contact->setName('New title');
        $contact->setOwner($user1);
        $contact->setIsPublic(false);
        $contact->setTextMessage('Some text message');
        $em = $this->getEntityManager();
        $em->persist($contact);
        $em->flush();

        //try with OWNER
        $this->login($client, 'user1@example.com', 'belekas');
        $client->request('PUT', '/api/contacts/'.$contact->getId(), [
            'json' => ['title' => 'Modified title']
        ]);
        $this->assertResponseStatusCodeSame(200);

        $user2 = $this->createUser('user2@example.com', 'belekas');

        //try with NOT OWNER
        $this->login($client, 'user2@example.com', 'belekas');
        $client->request('PUT', '/api/contacts/'.$contact->getId(), [
            'json' => [
                'title' => 'Modified2 title',

            ],

        ]);
        $this->assertResponseStatusCodeSame(403);

        //try to hack in owner
        $this->login($client, 'user2@example.com', 'belekas');
        $client->request('PUT', '/api/contacts/'.$contact->getId(), [
            'json' => [
                'owner' => '/api/users/'.$user2->getId(),
                'title' => 'Modified2 title',

            ],

        ]);
        $this->assertResponseStatusCodeSame(403);

        //try with admin
        $userAdmin = $this->createUser('admin@example.com', 'belekas', 'ROLE_ADMIN');
        $this->login($client, 'admin@example.com', 'belekas');
        $client->request('PUT', '/api/contacts/'.$contact->getId(), [
            'json' => ['title' => 'ADMIN Modified title']
        ]);
        $this->assertResponseStatusCodeSame(200);
    }
}
