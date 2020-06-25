<?php


namespace App\Tests\Functional;

use App\Entity\Note;
use App\Entity\User;
use App\Test\CustomApiTestCase;
use Doctrine\ORM\EntityManagerInterface;
use Hautelook\AliceBundle\PhpUnit\ReloadDatabaseTrait;

class NoteResourceTest extends CustomApiTestCase
{
    use ReloadDatabaseTrait;

    public function testCreateNote()
    {
        $client = self::createClient();

        $client->request(
            'POST',
            '/api/notes',
            ['json' => []]
        );

        $this->assertResponseStatusCodeSame(400);

        $this->createUserAndLogin($client, 'tester@testit.com', 'foo');
    }

    public function testUpdateNote()
    {
        //just to initialize
        $client = self::createClient();
        $user1 = $this->createUser('user1@example.com', 'belekas');

        $note = new Note();
        $note->setTitle('New title');
        $note->setOwner($user1);
        $note->setIsPublic(false);
        $note->setTextMessage('Some text message');
        $em = $this->getEntityManager();
        $em->persist($note);
        $em->flush();

        //try with OWNER
        $this->login($client, 'user1@example.com', 'belekas');
        $client->request('PUT', '/api/notes/'.$note->getId(), [
            'json' => ['title' => 'Modified title']
        ]);
        $this->assertResponseStatusCodeSame(200);

        $user2 = $this->createUser('user2@example.com', 'belekas');

        //try with NOT OWNER
        $this->login($client, 'user2@example.com', 'belekas');
        $client->request('PUT', '/api/notes/'.$note->getId(), [
            'json' => [
                'title' => 'Modified2 title',

            ],

        ]);
        $this->assertResponseStatusCodeSame(403);

        //try to hack in owner
        $this->login($client, 'user2@example.com', 'belekas');
        $client->request('PUT', '/api/notes/'.$note->getId(), [
            'json' => [
                'owner' => '/api/users/'.$user2->getId(),
                'title' => 'Modified2 title',

            ],

        ]);
        $this->assertResponseStatusCodeSame(403);

        //try with admin
        $userAdmin = $this->createUser('admin@example.com', 'belekas', 'ROLE_ADMIN');
        $this->login($client, 'admin@example.com', 'belekas');
        $client->request('PUT', '/api/notes/'.$note->getId(), [
            'json' => ['title' => 'ADMIN Modified title']
        ]);
        $this->assertResponseStatusCodeSame(200);
    }
}
