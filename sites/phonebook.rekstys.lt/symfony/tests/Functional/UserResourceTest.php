<?php

namespace App\Tests\Functional;

use App\Entity\User;
use App\Test\CustomApiTestCase;
use Hautelook\AliceBundle\PhpUnit\ReloadDatabaseTrait;

class UserResourceTest extends CustomApiTestCase
{
    use ReloadDatabaseTrait;

    public function testCreateUser()
    {
        $client = self::createClient();

        $client->request('POST', '/api/users', [
            'json' => [
                'email' => 'asd@asd.as',
                'password' =>  'asd',
            ],
        ]);

        $this->assertResponseStatusCodeSame(201);

        $this->login($client, 'asd@asd.as', 'asd');
    }

    public function testUpdateUser()
    {
        $client = self::createClient();
        $user = $this->createUserAndLogin($client, 'asd@asd.as', 'asd');
        $client->request('PUT', '/api/users/' . $user->getId(), [
            'json' => ['email' => 'asdasd@asd.as', 'roles' => ['ROLE_ADMIN']]
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains(
            [
                'email' => 'asdasd@asd.as'
            ]
        );

        $em = $this->getEntityManager();
        /** @var User $user */
        $user = $em->getRepository(User::class)->find($user->getId());
        var_dump($user->getRoles());
        $this->assertEquals(['ROLE_USER'], $user->getRoles());
    }

    public function testGetUser()
    {
        $client = self::createClient();
        $user = $this->createUser('asd@asd.as', 'asd');
        $this->createUserAndLogin($client, 'asd2@asd.as', 'asd');

        $user->setPhoneNumber('646.011.77');
        $em = $this->getEntityManager();
        $em->flush();

        $client->request('GET', '/api/users/'.$user->getId());
        $this->assertJsonContains(
            [
                'email' => 'asd@asd.as'
            ]
        );

        $data = $client->getResponse()->toArray();
        $this->assertArrayNotHasKey('phoneNumber', $data);

        //refresh user object (after client->request)
        $user = $em->getRepository(User::class)->find($user->getId());
        $user->setRoles(['ROLE_ADMIN']);
        $em->flush();
        $this->login($client, 'asd@asd.as', 'asd');

        $client->request('GET', '/api/users/'.$user->getId());
        $this->assertJsonContains(
            [
                'phoneNumber' => '646.011.77'
            ]
        );
    }

}